export interface BookmarkLink {
  label: string;
  url: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  links: BookmarkLink[];
  folders: BookmarkFolder[];
}

export interface BookmarkFile {
  name: string;
  folders: BookmarkFolder[];
}
