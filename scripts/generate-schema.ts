/**
 * Generates public/schema.json from the Zod BookmarkFileSchema.
 * Run with: node --experimental-strip-types scripts/generate-schema.ts
 *
 * The schema is served at /schema.json by the HonoJS server.
 * Users can reference it in their bookmarks.yml for editor validation:
 *
 *   # yaml-language-server: $schema=https://your-instance/schema.json
 */

import { writeFileSync } from "node:fs";
import { z } from "zod";
import { BookmarkFileSchema } from "../src/schema.ts";

const jsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Team Bookmarks",
  description:
    "Schema for team-bookmarks YAML files. See https://github.com/slashgear/team-bookmarks",
  ...z.toJSONSchema(BookmarkFileSchema, { target: "draft-2020-12" }),
};

writeFileSync("public/schema.json", JSON.stringify(jsonSchema, null, 2) + "\n");
console.log("✓ Generated public/schema.json");
