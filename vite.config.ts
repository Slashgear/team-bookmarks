import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { visualizer } from "rollup-plugin-visualizer";

const analyze = process.env["ANALYZE"] === "true";

export default defineConfig({
  plugins: [
    preact(),
    analyze &&
      visualizer({
        open: true,
        filename: "dist/bundle-stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  build: {
    target: "es2022",
    outDir: "dist",
    reportCompressedSize: true,
  },
});
