import type { BookmarkFile } from "../types.ts";
import { downloadNetscape } from "../services/export.ts";

interface Props {
  file: BookmarkFile;
  onClose: () => void;
}

export function NetscapeExportModal({ file, onClose }: Props) {
  function handleDownload() {
    downloadNetscape(file);
    onClose();
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div class="modal-backdrop" onClick={handleBackdrop} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal">
        <header class="modal-header">
          <h2 id="modal-title">Export bookmarks as HTML</h2>
          <button type="button" class="modal-close ghost" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </header>

        <div class="modal-body">
          <p class="modal-intro">
            The <strong>Netscape Bookmark HTML</strong> format is universally supported by all major
            browsers. Download the file, then follow the instructions for your browser.
          </p>

          <div class="modal-browsers">
            <div class="browser-card">
              <div class="browser-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.8"/>
                  <path d="M12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M2 12h4M18 12h4M12 2v4M12 18v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h3>Chrome / Edge / Brave</h3>
              <ol>
                <li>Open the menu <kbd>⋮</kbd> → <strong>Bookmarks</strong> → <strong>Bookmark manager</strong></li>
                <li>Click the menu <kbd>⋮</kbd> at the top right of the manager</li>
                <li>Select <strong>Import bookmarks</strong></li>
                <li>Choose the downloaded <code>.html</code> file</li>
              </ol>
              <a
                href="https://support.google.com/chrome/answer/96816"
                target="_blank"
                rel="noopener noreferrer"
                class="browser-link"
              >
                Official guide →
              </a>
            </div>

            <div class="browser-card">
              <div class="browser-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h3>Firefox</h3>
              <ol>
                <li>Open the menu <kbd>☰</kbd> → <strong>Bookmarks</strong> → <strong>Manage Bookmarks</strong></li>
                <li>Click <strong>Import and Backup</strong> in the toolbar</li>
                <li>Select <strong>Import Bookmarks from HTML…</strong></li>
                <li>Choose the downloaded <code>.html</code> file</li>
              </ol>
              <a
                href="https://support.mozilla.org/en-US/kb/import-bookmarks-html-file"
                target="_blank"
                rel="noopener noreferrer"
                class="browser-link"
              >
                Official guide →
              </a>
            </div>

            <div class="browser-card">
              <div class="browser-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  <path d="M12 2v20M3 7l9 5 9-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3>Safari</h3>
              <ol>
                <li>Open <strong>File</strong> menu → <strong>Import From</strong> → <strong>Bookmarks HTML File…</strong></li>
                <li>Choose the downloaded <code>.html</code> file</li>
                <li>Your bookmarks will appear in a new <strong>Imported</strong> folder</li>
              </ol>
              <a
                href="https://support.apple.com/guide/safari/import-bookmarks-and-passwords-ibrw1015/mac"
                target="_blank"
                rel="noopener noreferrer"
                class="browser-link"
              >
                Official guide →
              </a>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <button type="button" class="ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" class="primary" onClick={handleDownload}>
            Download HTML file
          </button>
        </footer>
      </div>
    </div>
  );
}
