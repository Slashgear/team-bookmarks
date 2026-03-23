import { triggerDownload } from "../utils/download.ts";
import type { BookmarkFile, BookmarkFolder, BookmarkLink } from "../types.ts";

// --- NETSCAPE Bookmark HTML ---

function folderToNetscape(folder: BookmarkFolder, indent: number): string {
  const pad = "    ".repeat(indent);
  const now = Math.floor(Date.now() / 1000);
  let out = `${pad}<DT><H3 ADD_DATE="${now}">${escapeHtml(folder.name)}</H3>\n`;
  out += `${pad}<DL><p>\n`;
  for (const link of folder.links) {
    out += linkToNetscape(link, indent + 1);
  }
  for (const sub of folder.folders) {
    out += folderToNetscape(sub, indent + 1);
  }
  out += `${pad}</DL><p>\n`;
  return out;
}

function linkToNetscape(link: BookmarkLink, indent: number): string {
  const pad = "    ".repeat(indent);
  const now = Math.floor(Date.now() / 1000);
  return `${pad}<DT><A HREF="${escapeAttr(link.url)}" ADD_DATE="${now}">${escapeHtml(link.label)}</A>\n`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

export function buildNetscape(file: BookmarkFile): string {
  let out = `<!DOCTYPE NETSCAPE-Bookmark-file-1>\n`;
  out += `<!-- This is an automatically generated file. -->\n`;
  out += `<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n`;
  out += `<TITLE>${escapeHtml(file.name)}</TITLE>\n`;
  out += `<H1>${escapeHtml(file.name)}</H1>\n`;
  out += `<DL><p>\n`;
  for (const folder of file.folders) {
    out += folderToNetscape(folder, 1);
  }
  out += `</DL><p>\n`;
  return out;
}

// --- JSON ---

export function buildJson(file: BookmarkFile): string {
  const strip = (folder: BookmarkFolder): object => ({
    name: folder.name,
    links: folder.links,
    folders: folder.folders.map(strip),
  });
  return JSON.stringify({ name: file.name, folders: file.folders.map(strip) }, null, 2);
}

// --- Download triggers ---

export async function downloadYaml(file: BookmarkFile): Promise<void> {
  const { serializeYaml } = await import("./yaml.ts");
  triggerDownload(serializeYaml(file), "bookmarks.yml", "text/yaml;charset=utf-8");
}

export function downloadNetscape(file: BookmarkFile): void {
  triggerDownload(buildNetscape(file), "bookmarks.html", "text/html;charset=utf-8");
}

export function downloadJson(file: BookmarkFile): void {
  triggerDownload(buildJson(file), "bookmarks.json", "application/json;charset=utf-8");
}
