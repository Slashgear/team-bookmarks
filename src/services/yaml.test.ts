import { describe, expect, it } from "vitest";
import { parseYaml, serializeYaml } from "./yaml.ts";

const VALID_YAML = `
name: My Team
folders:
  - name: Dev Tools
    links:
      - label: GitHub
        url: https://github.com
    folders:
      - name: Monitoring
        links:
          - label: Grafana
            url: https://grafana.com
`;

describe("parseYaml", () => {
  it("parses a valid YAML file", () => {
    const result = parseYaml(VALID_YAML);
    expect(result.name).toBe("My Team");
    expect(result.folders).toHaveLength(1);
    expect(result.folders[0]?.name).toBe("Dev Tools");
    expect(result.folders[0]?.links[0]?.label).toBe("GitHub");
    expect(result.folders[0]?.folders[0]?.name).toBe("Monitoring");
  });

  it("attaches a unique id to each folder", () => {
    const result = parseYaml(VALID_YAML);
    const root = result.folders[0];
    const sub = root?.folders[0];
    expect(root?.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(sub?.id).not.toBe(root?.id);
  });

  it("defaults missing links and folders to empty arrays", () => {
    const result = parseYaml("name: Empty\nfolders:\n  - name: A\n");
    expect(result.folders[0]?.links).toEqual([]);
    expect(result.folders[0]?.folders).toEqual([]);
  });

  it("throws on invalid YAML structure", () => {
    expect(() => parseYaml("not_valid: [unclosed")).toThrow();
  });

  it("throws when name is missing", () => {
    expect(() => parseYaml("folders: []")).toThrow();
  });
});

describe("serializeYaml", () => {
  it("round-trips a parsed file without ids", () => {
    const parsed = parseYaml(VALID_YAML);
    const serialized = serializeYaml(parsed);
    expect(serialized).not.toContain("id:");
    expect(serialized).toContain("name: My Team");
    expect(serialized).toContain("label: GitHub");
  });

  it("produces valid YAML that can be re-parsed", () => {
    const parsed = parseYaml(VALID_YAML);
    const serialized = serializeYaml(parsed);
    const reparsed = parseYaml(serialized);
    expect(reparsed.name).toBe(parsed.name);
    expect(reparsed.folders[0]?.name).toBe(parsed.folders[0]?.name);
  });
});
