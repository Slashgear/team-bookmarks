import * as jsYaml from "js-yaml";
import { BookmarkFileSchema } from "../schema.ts";
import type { BookmarkFile, BookmarkFolder } from "../types.ts";

// This entire module is lazy-loaded as a single chunk (js-yaml + zod + schemas).
// It is preloaded via requestIdleCallback — see src/utils/preload.ts.

type ParsedFile = { name: string; folders: Array<Omit<BookmarkFolder, "id"> & { folders: unknown[] }> };

function attachIds(folder: ParsedFile["folders"][number]): BookmarkFolder {
  return {
    ...folder,
    id: crypto.randomUUID(),
    folders: (folder.folders as ParsedFile["folders"]).map(attachIds),
  };
}

export function parseYaml(content: string): BookmarkFile {
  const raw = jsYaml.load(content);
  const parsed = BookmarkFileSchema.parse(raw);
  return { ...parsed, folders: parsed.folders.map(attachIds) };
}

function stripIds(folder: BookmarkFolder): Omit<BookmarkFolder, "id"> {
  const { id: _id, folders, ...rest } = folder;
  return { ...rest, folders: folders.map(stripIds) };
}

export function serializeYaml(file: BookmarkFile): string {
  const stripped = { name: file.name, folders: file.folders.map(stripIds) };
  return jsYaml.dump(stripped, { indent: 2, lineWidth: 120 });
}
