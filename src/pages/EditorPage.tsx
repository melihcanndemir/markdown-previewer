import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";
import Settings from "../components/Settings";
import { 
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { useNotesStore } from "../store/notesStore";
import { useSettingsStore } from "../store/settingsStore";

// Type Definitions
interface EditorPageProps {
  showSettings: boolean;
  onSettingsVisibilityChange: (visible: boolean) => void;
}

const EditorPage: React.FC<EditorPageProps> = ({
  showSettings,
  onSettingsVisibilityChange,
}) => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();

  // Get state and actions from stores
  const { notes, updateNote, getNoteById } = useNotesStore();
  const { isDark, settings, setSettings } = useSettingsStore();

  // Find current note
  const currentNote = getNoteById(noteId || "") || notes[0];

  // Handle note content change
  const handleContentChange = (content: string) => {
    if (currentNote) {
      updateNote(currentNote.id, { content });
    }
  };

  // Component fullscreen states
  const [isEditorFullScreen, setIsEditorFullScreen] = useState(false);
  const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);

  // Handle import
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file && currentNote) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const content = e.target?.result as string;
          if (content !== null) {
            updateNote(currentNote.id, {
              content,
              title: file.name.replace('.md', '')
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Handle export
  const handleExport = () => {
    if (!currentNote) return;
    
    const blob = new Blob([currentNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNote.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700"
              : "bg-white hover:bg-gray-50"
          }`}
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <input
          type="text"
          value={currentNote?.title || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (currentNote) {
              updateNote(currentNote.id, { title: e.target.value });
            }
          }}
          className={`text-2xl font-bold bg-transparent outline-none ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        />
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleImport}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-white hover:bg-gray-50"
            }`}
            title="Import"
            aria-label="Import"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleExport}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-white hover:bg-gray-50"
            }`}
            title="Export"
            aria-label="Export"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className={`grid ${
        isEditorFullScreen || isPreviewFullScreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
      } gap-6`}>
        {!isPreviewFullScreen && (
          <MarkdownEditor
            value={currentNote?.content || ""}
            onChange={handleContentChange}
            isDark={isDark}
            settings={settings}
            isFullScreen={isEditorFullScreen}
            onFullScreenToggle={() => setIsEditorFullScreen(!isEditorFullScreen)}
          />
        )}
        {!isEditorFullScreen && (
          <MarkdownPreview
            markdown={currentNote?.content || ""}
            isDark={isDark}
            settings={settings}
            isFullScreen={isPreviewFullScreen}
            onFullScreenToggle={() => setIsPreviewFullScreen(!isPreviewFullScreen)}
          />
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Settings
          onClose={() => onSettingsVisibilityChange(false)}
        />
      )}
    </div>
  );
}

export default EditorPage; 