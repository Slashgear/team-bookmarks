/**
 * Post-build compression script.
 * Generates .br (Brotli, quality 11) and .gz (Zopfli) variants
 * for every compressible asset in dist/.
 * HonoJS serveStatic with { precompressed: true } will serve these
 * automatically based on the client's Accept-Encoding header.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { brotliCompress, constants } from "node:zlib";
import { promisify } from "node:util";
import zopfli from "@gfx/zopfli";

const brotliCompressAsync = promisify(brotliCompress);

const COMPRESSIBLE = new Set([".js", ".css", ".html", ".svg", ".json", ".txt", ".xml", ".wasm"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else {
      yield path;
    }
  }
}

async function run(distDir) {
  let count = 0;

  for await (const file of walk(distDir)) {
    if (!COMPRESSIBLE.has(extname(file))) continue;

    const content = await readFile(file);

    const [br, gz] = await Promise.all([
      // Brotli — maximum quality (11)
      brotliCompressAsync(content, {
        params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
      }),
      // Zopfli — gzip-compatible, better ratio than standard gzip
      new Promise((resolve, reject) =>
        zopfli.gzip(content, { numiterations: 15 }, (err, result) =>
          err ? reject(err) : resolve(result),
        ),
      ),
    ]);

    await Promise.all([writeFile(`${file}.br`, br), writeFile(`${file}.gz`, gz)]);

    count++;
  }

  console.log(`✓ Compressed ${count} files (Brotli + Zopfli) in ${distDir}`);
}

run("dist").catch((err) => {
  console.error("Compression failed:", err);
  process.exit(1);
});
