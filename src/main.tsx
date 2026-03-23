import { render } from "preact";
import { App } from "./app.tsx";
import { preloadYaml } from "./utils/preload.ts";
import "./app.css";

// Set canonical + og:url dynamically so any self-hosted instance gets the correct URL
const pageUrl = window.location.origin + window.location.pathname;
const canonical = document.createElement("link");
canonical.rel = "canonical";
canonical.href = pageUrl;
document.head.appendChild(canonical);
document.querySelector('meta[property="og:url"]')?.setAttribute("content", pageUrl);

render(<App />, document.getElementById("app")!);

// Preload the yaml chunk (js-yaml + zod) once the browser is idle
// so it's ready before the user triggers import/export.
preloadYaml();
