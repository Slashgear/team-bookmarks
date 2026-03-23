import { z } from "zod";
import type { BookmarkFolder } from "./types.ts";

export const BookmarkLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const BookmarkFolderSchema: z.ZodType<Omit<BookmarkFolder, "id">> = z.object({
  name: z.string(),
  links: z.array(BookmarkLinkSchema).default([]),
  folders: z.lazy(() => z.array(BookmarkFolderSchema)).default([]),
});

export const BookmarkFileSchema = z.object({
  name: z.string(),
  folders: z.array(BookmarkFolderSchema).default([]),
});
