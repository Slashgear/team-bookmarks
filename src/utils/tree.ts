import type { BookmarkFile, BookmarkFolder, BookmarkLink } from "../types.ts";

// --- Folder mutations ---

export function addFolder(file: BookmarkFile, parentId: string | null, name: string): BookmarkFile {
  const newFolder: BookmarkFolder = {
    id: crypto.randomUUID(),
    name,
    links: [],
    folders: [],
  };

  if (parentId === null) {
    return { ...file, folders: [...file.folders, newFolder] };
  }

  return { ...file, folders: file.folders.map((f) => insertInto(f, parentId, newFolder)) };
}

function insertInto(
  folder: BookmarkFolder,
  parentId: string,
  newFolder: BookmarkFolder,
): BookmarkFolder {
  if (folder.id === parentId) {
    return { ...folder, folders: [...folder.folders, newFolder] };
  }
  return { ...folder, folders: folder.folders.map((f) => insertInto(f, parentId, newFolder)) };
}

export function renameFolder(file: BookmarkFile, folderId: string, name: string): BookmarkFile {
  return { ...file, folders: file.folders.map((f) => applyRename(f, folderId, name)) };
}

function applyRename(folder: BookmarkFolder, folderId: string, name: string): BookmarkFolder {
  if (folder.id === folderId) return { ...folder, name };
  return { ...folder, folders: folder.folders.map((f) => applyRename(f, folderId, name)) };
}

export function removeFolder(file: BookmarkFile, folderId: string): BookmarkFile {
  return {
    ...file,
    folders: file.folders
      .filter((f) => f.id !== folderId)
      .map((f) => applyRemoveFolder(f, folderId)),
  };
}

function applyRemoveFolder(folder: BookmarkFolder, folderId: string): BookmarkFolder {
  return {
    ...folder,
    folders: folder.folders
      .filter((f) => f.id !== folderId)
      .map((f) => applyRemoveFolder(f, folderId)),
  };
}

// --- Link mutations ---

export function addLink(file: BookmarkFile, folderId: string, link: BookmarkLink): BookmarkFile {
  return { ...file, folders: file.folders.map((f) => applyAddLink(f, folderId, link)) };
}

function applyAddLink(
  folder: BookmarkFolder,
  folderId: string,
  link: BookmarkLink,
): BookmarkFolder {
  if (folder.id === folderId) {
    return { ...folder, links: [...folder.links, link] };
  }
  return { ...folder, folders: folder.folders.map((f) => applyAddLink(f, folderId, link)) };
}

export function removeLink(file: BookmarkFile, folderId: string, linkIndex: number): BookmarkFile {
  return {
    ...file,
    folders: file.folders.map((f) => applyRemoveLink(f, folderId, linkIndex)),
  };
}

function applyRemoveLink(
  folder: BookmarkFolder,
  folderId: string,
  linkIndex: number,
): BookmarkFolder {
  if (folder.id === folderId) {
    return { ...folder, links: folder.links.filter((_, i) => i !== linkIndex) };
  }
  return {
    ...folder,
    folders: folder.folders.map((f) => applyRemoveLink(f, folderId, linkIndex)),
  };
}

export function updateLink(
  file: BookmarkFile,
  folderId: string,
  linkIndex: number,
  link: BookmarkLink,
): BookmarkFile {
  return {
    ...file,
    folders: file.folders.map((f) => applyUpdateLink(f, folderId, linkIndex, link)),
  };
}

function applyUpdateLink(
  folder: BookmarkFolder,
  folderId: string,
  linkIndex: number,
  link: BookmarkLink,
): BookmarkFolder {
  if (folder.id === folderId) {
    return {
      ...folder,
      links: folder.links.map((l, i) => (i === linkIndex ? link : l)),
    };
  }
  return {
    ...folder,
    folders: folder.folders.map((f) => applyUpdateLink(f, folderId, linkIndex, link)),
  };
}
