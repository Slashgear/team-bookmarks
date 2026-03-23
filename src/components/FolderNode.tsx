import { useState } from "preact/hooks";
import type { BookmarkFolder, BookmarkLink } from "../types.ts";
import { LinkRow } from "./LinkRow.tsx";

interface Props {
  folder: BookmarkFolder;
  onAddFolder: (parentId: string | null, name: string) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onRemoveFolder: (folderId: string) => void;
  onAddLink: (folderId: string, link: BookmarkLink) => void;
  onUpdateLink: (folderId: string, index: number, link: BookmarkLink) => void;
  onRemoveLink: (folderId: string, index: number) => void;
}

export function FolderNode({
  folder,
  onAddFolder,
  onRenameFolder,
  onRemoveFolder,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
}: Props) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder.name);
  const [addingLink, setAddingLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  function submitRename(e: Event) {
    e.preventDefault();
    if (renameValue.trim()) {
      onRenameFolder(folder.id, renameValue.trim());
    }
    setIsRenaming(false);
  }

  function submitAddLink(e: Event) {
    e.preventDefault();
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      onAddLink(folder.id, { label: newLinkLabel.trim(), url: newLinkUrl.trim() });
      setNewLinkLabel("");
      setNewLinkUrl("");
      setAddingLink(false);
    }
  }

  return (
    <details class="folder" open>
      <summary class="folder-summary">
        {isRenaming ? (
          <form class="inline-form" onSubmit={submitRename}>
            <input
              type="text"
              value={renameValue}
              onInput={(e) => setRenameValue((e.currentTarget as HTMLInputElement).value)}
              aria-label="Folder name"
              autoFocus
              required
            />
            <button type="submit" aria-label="Save name">
              ✓
            </button>
            <button type="button" aria-label="Cancel rename" onClick={() => setIsRenaming(false)}>
              ✕
            </button>
          </form>
        ) : (
          <span class="folder-name">{folder.name}</span>
        )}

        <span class="folder-actions" role="group" aria-label={`Actions for ${folder.name}`}>
          <button
            type="button"
            aria-label={`Rename ${folder.name}`}
            onClick={(e) => {
              e.preventDefault();
              setRenameValue(folder.name);
              setIsRenaming(true);
            }}
          >
            ✎
          </button>
          <button
            type="button"
            aria-label={`Add subfolder to ${folder.name}`}
            onClick={(e) => {
              e.preventDefault();
              onAddFolder(folder.id, "New folder");
            }}
          >
            + Folder
          </button>
          <button
            type="button"
            aria-label={`Add link to ${folder.name}`}
            onClick={(e) => {
              e.preventDefault();
              setAddingLink(true);
            }}
          >
            + Link
          </button>
          <button
            type="button"
            class="danger"
            aria-label={`Delete ${folder.name}`}
            onClick={(e) => {
              e.preventDefault();
              if (confirm(`Delete folder "${folder.name}" and all its contents?`)) {
                onRemoveFolder(folder.id);
              }
            }}
          >
            ✕
          </button>
        </span>
      </summary>

      <div class="folder-content">
        {folder.links.map((link, i) => (
          <LinkRow
            key={`${folder.id}-${i}`}
            link={link}
            onUpdate={(updated) => onUpdateLink(folder.id, i, updated)}
            onRemove={() => onRemoveLink(folder.id, i)}
          />
        ))}

        {addingLink && (
          <form class="add-link-form" onSubmit={submitAddLink}>
            <input
              type="text"
              placeholder="Label"
              value={newLinkLabel}
              onInput={(e) => setNewLinkLabel((e.currentTarget as HTMLInputElement).value)}
              required
              aria-label="Link label"
              autoFocus
            />
            <input
              type="url"
              placeholder="https://..."
              value={newLinkUrl}
              onInput={(e) => setNewLinkUrl((e.currentTarget as HTMLInputElement).value)}
              required
              aria-label="Link URL"
            />
            <button type="submit">Add</button>
            <button type="button" onClick={() => setAddingLink(false)}>
              Cancel
            </button>
          </form>
        )}

        {folder.folders.map((sub) => (
          <FolderNode
            key={sub.id}
            folder={sub}
            onAddFolder={onAddFolder}
            onRenameFolder={onRenameFolder}
            onRemoveFolder={onRemoveFolder}
            onAddLink={onAddLink}
            onUpdateLink={onUpdateLink}
            onRemoveLink={onRemoveLink}
          />
        ))}
      </div>
    </details>
  );
}
