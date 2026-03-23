import type { BookmarkFile } from "../types.ts";

const STORAGE_KEY = "team-bookmarks:state";

export function saveToStorage(file: BookmarkFile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(file));
  } catch {
    // Silently fail if localStorage is unavailable (private mode, quota exceeded)
  }
}

export function loadFromStorage(): BookmarkFile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BookmarkFile;
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
