import { useState } from "preact/hooks";
import type { BookmarkLink } from "../types.ts";

interface Props {
  link: BookmarkLink;
  onUpdate: (link: BookmarkLink) => void;
  onRemove: () => void;
}

export function LinkRow({ link, onUpdate, onRemove }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(link.label);
  const [url, setUrl] = useState(link.url);

  function submitEdit(e: Event) {
    e.preventDefault();
    if (label.trim() && url.trim()) {
      onUpdate({ label: label.trim(), url: url.trim() });
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <form class="link-row link-row--editing" onSubmit={submitEdit}>
        <input
          type="text"
          value={label}
          onInput={(e) => setLabel((e.currentTarget as HTMLInputElement).value)}
          aria-label="Link label"
          required
          autoFocus
        />
        <input
          type="url"
          value={url}
          onInput={(e) => setUrl((e.currentTarget as HTMLInputElement).value)}
          aria-label="Link URL"
          required
        />
        <button type="submit" aria-label="Save link">
          ✓
        </button>
        <button
          type="button"
          aria-label="Cancel edit"
          onClick={() => {
            setLabel(link.label);
            setUrl(link.url);
            setIsEditing(false);
          }}
        >
          ✕
        </button>
      </form>
    );
  }

  return (
    <div class="link-row">
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
      <span class="link-actions">
        <button type="button" aria-label={`Edit ${link.label}`} onClick={() => setIsEditing(true)}>
          ✎
        </button>
        <button
          type="button"
          class="danger"
          aria-label={`Remove ${link.label}`}
          onClick={() => {
            if (confirm(`Remove link "${link.label}"?`)) onRemove();
          }}
        >
          ✕
        </button>
      </span>
    </div>
  );
}
