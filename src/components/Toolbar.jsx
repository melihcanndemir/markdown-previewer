import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

function Toolbar({ markdown, setMarkdown, isDark }) {
  const [notification, setNotification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const showNotification = useCallback((message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setIsProcessing(true);
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.md";

      // Add to recent files list
      const recentFiles = JSON.parse(
        localStorage.getItem("recent-files") || "[]"
      );
      const newFile = {
        name: "document.md",
        date: new Date().toISOString(),
        preview: markdown.slice(0, 100),
      };
      localStorage.setItem(
        "recent-files",
        JSON.stringify([newFile, ...recentFiles].slice(0, 5))
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification("File exported successfully", "success");
    } catch (error) {
      console.error("Export error:", error);
      showNotification("Failed to export file");
    } finally {
      setIsProcessing(false);
    }
  }, [markdown, showNotification]);

  const handleImport = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        setIsProcessing(true);

        if (!file.name.toLowerCase().endsWith(".md")) {
          showNotification("Please select a markdown (.md) file");
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          showNotification("File size exceeds 10MB limit");
          return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const content = e.target.result;
            setMarkdown(content);

            // Add to recent files list
            const recentFiles = JSON.parse(
              localStorage.getItem("recent-files") || "[]"
            );
            const newFile = {
              name: file.name,
              date: new Date().toISOString(),
              preview: content.slice(0, 100),
            };
            localStorage.setItem(
              "recent-files",
              JSON.stringify([newFile, ...recentFiles].slice(0, 5))
            );

            showNotification("File imported successfully", "success");
          } catch (error) {
            console.error("Import processing error:", error);
            showNotification("Failed to process file");
          }
        };

        reader.onerror = () => {
          showNotification("Failed to read file");
        };

        reader.readAsText(file);
      } catch (error) {
        console.error("Import error:", error);
        showNotification("Failed to import file");
      } finally {
        setIsProcessing(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [setMarkdown, showNotification]
  );

  const triggerFileInput = useCallback(() => {
    if (isProcessing) return;
    fileInputRef.current?.click();
  }, [isProcessing]);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      const mdFile = files.find((file) =>
        file.name.toLowerCase().endsWith(".md")
      );

      if (mdFile) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mdFile);
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
          handleImport({ target: fileInputRef.current });
        }
      } else {
        showNotification("Please drop a markdown (.md) file");
      }
    },
    [handleImport, showNotification]
  );

  return (
    <>
      <div
        className="flex items-center gap-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Import Button */}
        <button
          onClick={triggerFileInput}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
            isDark
              ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
              : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          title={isProcessing ? "Processing..." : "Import markdown file"}
          aria-label={
            isProcessing ? "Processing import" : "Import markdown file"
          }
        >
          <ArrowUpTrayIcon
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isProcessing ? "animate-pulse" : ""
            }`}
          />
          <span className="hidden sm:inline text-sm sm:text-base">
            {isProcessing ? "Importing..." : "Import"}
          </span>
        </button>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
            isDark
              ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
              : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          title={isProcessing ? "Processing..." : "Export as markdown"}
          aria-label={isProcessing ? "Processing export" : "Export as markdown"}
        >
          <ArrowDownTrayIcon
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isProcessing ? "animate-pulse" : ""
            }`}
          />
          <span className="hidden sm:inline text-sm sm:text-base">
            {isProcessing ? "Exporting..." : "Export"}
          </span>
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".md"
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Notification */}
      {notification && (
        <div
          role="alert"
          className={`fixed bottom-4 right-4 flex items-center gap-2 p-3 rounded-lg z-50 shadow-lg backdrop-blur-sm transition-all duration-200 animate-in slide-in-from-right ${
            notification.type === "success"
              ? isDark
                ? "bg-green-900/90 text-green-100"
                : "bg-green-100 text-green-800"
              : isDark
              ? "bg-red-900/90 text-red-100"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <XCircleIcon className="w-5 h-5" />
          )}
          <p className="text-sm sm:text-base">{notification.message}</p>
        </div>
      )}
    </>
  );
}

Toolbar.propTypes = {
  markdown: PropTypes.string.isRequired,
  setMarkdown: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default Toolbar;
