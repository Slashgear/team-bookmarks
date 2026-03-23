import { useCallback, useEffect, useState } from "preact/hooks";
import { loadFromStorage, saveToStorage } from "../services/storage.ts";
import type { BookmarkFile, BookmarkLink } from "../types.ts";
import {
  addFolder,
  addLink,
  removeFolder,
  removeLink,
  renameFolder,
  updateLink,
} from "../utils/tree.ts";

const EXAMPLE_FILE: BookmarkFile = {
  name: "Slashgear Tools",
  folders: [
    {
      id: crypto.randomUUID(),
      name: "⚡ My Creations",
      links: [
        { label: "Blog", url: "https://blog.slashgear.dev" },
        { label: "Tools Galaxy", url: "https://blog.slashgear.dev/tools/" },
      ],
      folders: [
        {
          id: crypto.randomUUID(),
          name: "Team & Agile",
          links: [
            { label: "poker-planning", url: "https://github.com/Slashgear/poker-planning" },
            { label: "git-kata", url: "https://github.com/Slashgear/git-kata" },
            { label: "roadmap-maker", url: "https://github.com/Slashgear/roadmap-maker" },
          ],
          folders: [],
        },
        {
          id: crypto.randomUUID(),
          name: "CI & Quality",
          links: [
            {
              label: "action-check-pr-title",
              url: "https://github.com/Slashgear/action-check-pr-title",
            },
            { label: "flo-du-bot", url: "https://github.com/Slashgear/flo-du-bot" },
            {
              label: "gdpr-cookie-scanner",
              url: "https://github.com/Slashgear/gdpr-cookie-scanner",
            },
          ],
          folders: [],
        },
        {
          id: crypto.randomUUID(),
          name: "Content",
          links: [
            { label: "shortvid.io", url: "https://shortvid.io" },
            {
              label: "linkedin-carousel-gen",
              url: "https://github.com/Slashgear/linkedin-carousel-gen",
            },
          ],
          folders: [],
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "🛸 Tools I Love",
      links: [],
      folders: [
        {
          id: crypto.randomUUID(),
          name: "AI & Coding",
          links: [
            { label: "Opencode", url: "https://opencode.ai" },
            { label: "DevStral 2", url: "https://mistral.ai/news/devstral" },
          ],
          folders: [],
        },
        {
          id: crypto.randomUUID(),
          name: "Productivity",
          links: [
            { label: "Handy", url: "https://handy.computer/" },
            { label: "Remotion", url: "https://www.remotion.dev" },
          ],
          folders: [],
        },
      ],
    },
  ],
};

export function useBookmarks() {
  const [file, setFile] = useState<BookmarkFile | null>(() => loadFromStorage());

  useEffect(() => {
    if (file) saveToStorage(file);
  }, [file]);

  const createEmpty = useCallback((name: string) => {
    setFile({ name, folders: [] });
  }, []);

  const loadExample = useCallback(() => {
    setFile(EXAMPLE_FILE);
  }, []);

  const importFile = useCallback((imported: BookmarkFile) => {
    setFile(imported);
  }, []);

  const reset = useCallback(() => {
    setFile(null);
  }, []);

  const doAddFolder = useCallback(
    (parentId: string | null, name: string) => {
      if (!file) return;
      setFile(addFolder(file, parentId, name));
    },
    [file],
  );

  const doRenameFolder = useCallback(
    (folderId: string, name: string) => {
      if (!file) return;
      setFile(renameFolder(file, folderId, name));
    },
    [file],
  );

  const doRemoveFolder = useCallback(
    (folderId: string) => {
      if (!file) return;
      setFile(removeFolder(file, folderId));
    },
    [file],
  );

  const doAddLink = useCallback(
    (folderId: string, link: BookmarkLink) => {
      if (!file) return;
      setFile(addLink(file, folderId, link));
    },
    [file],
  );

  const doUpdateLink = useCallback(
    (folderId: string, linkIndex: number, link: BookmarkLink) => {
      if (!file) return;
      setFile(updateLink(file, folderId, linkIndex, link));
    },
    [file],
  );

  const doRemoveLink = useCallback(
    (folderId: string, linkIndex: number) => {
      if (!file) return;
      setFile(removeLink(file, folderId, linkIndex));
    },
    [file],
  );

  return {
    file,
    createEmpty,
    loadExample,
    importFile,
    reset,
    addFolder: doAddFolder,
    renameFolder: doRenameFolder,
    removeFolder: doRemoveFolder,
    addLink: doAddLink,
    updateLink: doUpdateLink,
    removeLink: doRemoveLink,
  };
}
