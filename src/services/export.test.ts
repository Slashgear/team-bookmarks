import { describe, expect, it } from "vitest";
import type { BookmarkFile } from "../types.ts";
import { buildJson, buildNetscape } from "./export.ts";

const SAMPLE: BookmarkFile = {
  name: "My Team",
  folders: [
    {
      id: "1",
      name: "Dev Tools",
      links: [{ label: "GitHub", url: "https://github.com" }],
      folders: [
        {
          id: "2",
          name: "Monitoring",
          links: [{ label: "Grafana", url: "https://grafana.com" }],
          folders: [],
        },
      ],
    },
  ],
};

describe("buildNetscape", () => {
  it("starts with the NETSCAPE doctype", () => {
    const result = buildNetscape(SAMPLE);
    expect(result).toMatch(/^<!DOCTYPE NETSCAPE-Bookmark-file-1>/);
  });

  it("includes the collection name as title and h1", () => {
    const result = buildNetscape(SAMPLE);
    expect(result).toContain("<TITLE>My Team</TITLE>");
    expect(result).toContain("<H1>My Team</H1>");
  });

  it("renders folder names as H3", () => {
    const result = buildNetscape(SAMPLE);
    expect(result).toContain("<H3 ADD_DATE=");
    expect(result).toContain(">Dev Tools</H3>");
    expect(result).toContain(">Monitoring</H3>");
  });

  it("renders links as anchor tags", () => {
    const result = buildNetscape(SAMPLE);
    expect(result).toContain('HREF="https://github.com"');
    expect(result).toContain(">GitHub</A>");
    expect(result).toContain('HREF="https://grafana.com"');
  });

  it("nests subfolders inside their parent DL", () => {
    const result = buildNetscape(SAMPLE);
    const devIdx = result.indexOf("Dev Tools");
    const monIdx = result.indexOf("Monitoring");
    expect(devIdx).toBeLessThan(monIdx);
  });

  it("escapes HTML special characters in labels", () => {
    const file: BookmarkFile = {
      name: "Team & Co",
      folders: [
        {
          id: "x",
          name: "<Scripts>",
          links: [{ label: 'A "link"', url: "https://example.com" }],
          folders: [],
        },
      ],
    };
    const result = buildNetscape(file);
    expect(result).toContain("Team &amp; Co");
    expect(result).toContain("&lt;Scripts&gt;");
    expect(result).toContain('A "link"');
  });
});

describe("buildJson", () => {
  it("produces valid JSON", () => {
    expect(() => JSON.parse(buildJson(SAMPLE))).not.toThrow();
  });

  it("includes name and folders", () => {
    const parsed = JSON.parse(buildJson(SAMPLE));
    expect(parsed.name).toBe("My Team");
    expect(parsed.folders).toHaveLength(1);
    expect(parsed.folders[0].name).toBe("Dev Tools");
  });

  it("does not include folder ids", () => {
    const result = buildJson(SAMPLE);
    expect(result).not.toContain('"id"');
  });

  it("preserves nested structure", () => {
    const parsed = JSON.parse(buildJson(SAMPLE));
    expect(parsed.folders[0].folders[0].name).toBe("Monitoring");
  });
});
