import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

const app = new Hono();

// --- Security headers (Mozilla Observatory recommendations) ---
app.use("/*", async (c, next) => {
  await next();

  // Prevent MIME-type sniffing
  c.header("X-Content-Type-Options", "nosniff");

  // Deny framing entirely
  c.header("X-Frame-Options", "DENY");

  // Don't send referrer to cross-origin destinations
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");

  // Disable browser features not needed by this app
  c.header("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  // Isolate this browsing context from other origins
  c.header("Cross-Origin-Opener-Policy", "same-origin");
  c.header("Cross-Origin-Resource-Policy", "same-origin");

  // Force HTTPS on repeat visits (1 year)
  c.header("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // Content Security Policy — no inline scripts, no external resources
  c.header(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  );
});

// --- Cache control ---
app.use("/*", async (c, next) => {
  await next();

  const url = c.req.url;
  const isHashed = /\/assets\/[^/]+-[a-zA-Z0-9]{8}\.(js|css)/.test(url);

  if (isHashed) {
    // Vite content-hashed assets — cache forever
    c.header("Cache-Control", "public, max-age=31536000, immutable");
  } else if (url.endsWith(".html") || url === "/") {
    // HTML — always revalidate
    c.header("Cache-Control", "no-cache");
  } else {
    // Other static assets (favicon, etc.)
    c.header("Cache-Control", "public, max-age=86400");
  }
});

// --- JSON Schema endpoint ---
// Served with application/schema+json and open CORS so any editor or validator
// can fetch it directly from any self-hosted instance.
app.get("/schema.json", async (c) => {
  const { readFile } = await import("node:fs/promises");
  const content = await readFile("./dist/schema.json", "utf-8");
  return c.body(content, 200, {
    "Content-Type": "application/schema+json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=86400",
  });
});

// --- Static files ---
app.use(
  "/*",
  serveStatic({
    root: "./dist",
    precompressed: true,
  }),
);

// SPA fallback
app.get("*", serveStatic({ path: "./dist/index.html" }));

const port = Number(process.env["PORT"] ?? 3000);

// eslint-disable-next-line no-console
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}`);
});
