import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

function ToolBar({ markdown, setMarkdown, isDark }) {
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try {
      // Create blob and download link
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.md";

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export file");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only accept .md files
    if (!file.name.endsWith(".md")) {
      setError("Please select a markdown (.md) file");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        setMarkdown(content);
      } catch {
        setError("Failed to read file");
        setTimeout(() => setError(null), 3000);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file");
      setTimeout(() => setError(null), 3000);
    };

    reader.readAsText(file);
  };

  // Hidden file input for import
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Import Button */}
      <button
        onClick={triggerFileInput}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isDark
            ? "bg-slate-700 hover:bg-slate-600"
            : "bg-slate-200 hover:bg-slate-300"
        }`}
        title="Import markdown file"
      >
        <ArrowUpTrayIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Import</span>
      </button>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isDark
            ? "bg-slate-700 hover:bg-slate-600"
            : "bg-slate-200 hover:bg-slate-300"
        }`}
        title="Export as markdown"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Export</span>
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".md"
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg ${
            isDark ? "bg-red-900" : "bg-red-100"
          } text-red-500`}
        >
          {error}
        </div>
      )}
    </div>
  );
}

ToolBar.propTypes = {
  markdown: PropTypes.string.isRequired,
  setMarkdown: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default ToolBar;
