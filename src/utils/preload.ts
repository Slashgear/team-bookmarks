const IDLE_TIMEOUT_MS = 3000;

function whenIdle(cb: () => void): void {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(cb, { timeout: IDLE_TIMEOUT_MS });
  } else {
    setTimeout(cb, IDLE_TIMEOUT_MS);
  }
}

/**
 * Preloads the yaml chunk (js-yaml + zod + schemas) in the background.
 * Called once after first render so the chunk is already cached
 * when the user triggers an import or export.
 */
export function preloadYaml(): void {
  whenIdle(() => void import("../services/yaml.ts"));
}
