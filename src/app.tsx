import { useRef } from "preact/hooks";
import { FolderNode } from "./components/FolderNode.tsx";
import { Welcome } from "./components/Welcome.tsx";
import { useBookmarks } from "./hooks/useBookmarks.ts";
import { downloadJson, downloadNetscape, downloadYaml } from "./services/export.ts";

export function App() {
  const bm = useBookmarks();
  const importRef = useRef<HTMLInputElement>(null);

  function handleImport(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      import("./services/yaml.ts")
        .then(({ parseYaml }) => parseYaml(reader.result as string))
        .then(bm.importFile)
        .catch(() => alert("Invalid YAML file. Please check the format."));
    };
    reader.readAsText(file);
    input.value = "";
  }

  if (!bm.file) {
    return (
      <Welcome
        onCreateEmpty={bm.createEmpty}
        onLoadExample={bm.loadExample}
        onImport={() => importRef.current?.click()}
        importRef={importRef}
        onImportChange={handleImport}
      />
    );
  }

  const file = bm.file;

  return (
    <main class="layout">
      <header class="collection-header">
        <h1>{file.name}</h1>
        <nav class="collection-actions" aria-label="Collection actions">
          <button type="button" onClick={() => bm.addFolder(null, "New folder")}>
            + Folder
          </button>
          <button type="button" onClick={() => importRef.current?.click()}>
            Import YAML
          </button>
          <div class="export-group" role="group" aria-label="Export">
            <span class="export-label">Export:</span>
            <button type="button" onClick={() => downloadYaml(file)}>
              YAML
            </button>
            <button type="button" onClick={() => downloadNetscape(file)}>
              HTML
            </button>
            <button type="button" onClick={() => downloadJson(file)}>
              JSON
            </button>
          </div>
          <button type="button" class="ghost" onClick={bm.reset}>
            Reset
          </button>
        </nav>
        <input
          ref={importRef}
          type="file"
          accept=".yml,.yaml"
          aria-label="Import YAML file"
          class="visually-hidden"
          onChange={handleImport}
        />
      </header>

      <section aria-label="Bookmarks">
        {file.folders.length === 0 ? (
          <p class="empty-hint">No folders yet. Add one above.</p>
        ) : (
          file.folders.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              onAddFolder={bm.addFolder}
              onRenameFolder={bm.renameFolder}
              onRemoveFolder={bm.removeFolder}
              onAddLink={bm.addLink}
              onUpdateLink={bm.updateLink}
              onRemoveLink={bm.removeLink}
            />
          ))
        )}
      </section>
    </main>
  );
}
