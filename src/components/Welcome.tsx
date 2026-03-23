import type { RefObject } from "preact";
import { useState } from "preact/hooks";

interface Props {
  onCreateEmpty: (name: string) => void;
  onLoadExample: () => void;
  onImport: () => void;
  importRef: RefObject<HTMLInputElement>;
  onImportChange: (e: Event) => void;
}

export function Welcome({
  onCreateEmpty,
  onLoadExample,
  onImport,
  importRef,
  onImportChange,
}: Props) {
  const [name, setName] = useState("My Team");

  return (
    <main class="welcome">
      <header class="welcome-hero">
        <h1>Team Bookmarks</h1>
        <p class="welcome-tagline">
          Manage your team's useful links, export them as a <code>.yml</code> file, version it in
          your repository and share it with everyone.
        </p>
      </header>

      <section class="welcome-how" aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <ol class="steps">
          <li>
            <span class="step-icon" aria-hidden="true">
              ✏️
            </span>
            <div>
              <strong>Create your collection</strong>
              <p>
                Add folders, sub-folders and links with labels. Everything is saved automatically in
                your browser.
              </p>
            </div>
          </li>
          <li>
            <span class="step-icon" aria-hidden="true">
              📤
            </span>
            <div>
              <strong>Export</strong>
              <p>
                Download as <code>.yml</code> to version in Git, as <code>.html</code> to import
                directly into any browser, or as <code>.json</code> for custom integrations.
              </p>
            </div>
          </li>
          <li>
            <span class="step-icon" aria-hidden="true">
              🔁
            </span>
            <div>
              <strong>Share &amp; iterate</strong>
              <p>
                Commit the YAML file to your team repository. Anyone can re-import it, edit it and
                export again.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section aria-labelledby="start-heading">
        <h2 id="start-heading">Get started</h2>

        <div class="welcome-actions">
          <div class="welcome-card">
            <h3>New collection</h3>
            <p>Start from scratch with an empty bookmark list.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) onCreateEmpty(name.trim());
              }}
            >
              <label for="collection-name">Collection name</label>
              <input
                id="collection-name"
                type="text"
                value={name}
                onInput={(e) => setName((e.currentTarget as HTMLInputElement).value)}
                required
                minLength={1}
                maxLength={80}
              />
              <button type="submit">Create empty</button>
            </form>
          </div>

          <div class="welcome-card">
            <h3>Try an example</h3>
            <p>
              Load a pre-filled collection with{" "}
              <a href="https://blog.slashgear.dev/tools/" target="_blank" rel="noopener noreferrer">
                Slashgear's favorite tools
              </a>{" "}
              to explore all features.
            </p>
            <button type="button" onClick={onLoadExample}>
              Load example
            </button>
          </div>

          <div class="welcome-card">
            <h3>Import YAML</h3>
            <p>
              Already have a <code>.yml</code> bookmark file? Import it and keep editing.
            </p>
            <button type="button" onClick={onImport}>
              Import file
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".yml,.yaml"
              aria-label="Import YAML file"
              class="visually-hidden"
              onChange={onImportChange}
            />
          </div>
        </div>
      </section>

      <footer class="welcome-footer">
        <p>
          Open source · MIT ·{" "}
          <a
            href="https://github.com/slashgear/team-bookmarks"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
