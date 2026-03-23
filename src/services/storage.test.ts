import { afterEach, describe, expect, it } from "vitest";
import type { BookmarkFile } from "../types.ts";
import { clearStorage, loadFromStorage, saveToStorage } from "./storage.ts";

const SAMPLE: BookmarkFile = {
  name: "My Team",
  folders: [
    {
      id: "abc-123",
      name: "Dev Tools",
      links: [{ label: "GitHub", url: "https://github.com" }],
      folders: [],
    },
  ],
};

afterEach(() => {
  clearStorage();
});

describe("saveToStorage / loadFromStorage", () => {
  it("persists and retrieves a BookmarkFile", () => {
    saveToStorage(SAMPLE);
    const loaded = loadFromStorage();
    expect(loaded).toEqual(SAMPLE);
  });

  it("returns null when nothing is stored", () => {
    expect(loadFromStorage()).toBeNull();
  });

  it("overwrites a previous save", () => {
    saveToStorage(SAMPLE);
    const updated = { ...SAMPLE, name: "Updated" };
    saveToStorage(updated);
    expect(loadFromStorage()?.name).toBe("Updated");
  });
});

describe("clearStorage", () => {
  it("removes the stored data", () => {
    saveToStorage(SAMPLE);
    clearStorage();
    expect(loadFromStorage()).toBeNull();
  });
});
