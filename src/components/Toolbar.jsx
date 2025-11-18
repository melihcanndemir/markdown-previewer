import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  ArrowUpTrayIcon,
  XCircleIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import ExportMenu from "./ExportMenu";
import TemplateMenu from "./TemplateMenu";

function Toolbar({ markdown, setMarkdown, isDark, onOpenAI, settings, tabs, activeTabId }) {
  const [notification, setNotification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const showNotification = useCallback((message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

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
          showNotification("File size exceeds 10MB limit");
          return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const content = e.target.result;
            setMarkdown(content);

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
        role="toolbar"
        aria-label="Document actions"
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
          aria-label={isProcessing ? "Processing import" : "Import markdown file"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              triggerFileInput();
            }
          }}
        >
          <ArrowUpTrayIcon
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isProcessing ? "animate-pulse" : ""
            }`}
            aria-hidden="true"
          />
          <span className="hidden sm:inline text-sm sm:text-base">
            {isProcessing ? "Importing..." : "Import"}
          </span>
        </button>

        {/* Template Menu */}
        <TemplateMenu
          onLoadTemplate={setMarkdown}
          isDark={isDark}
          currentMarkdown={markdown}
        />

        {/* Export Menu */}
        <ExportMenu
          markdown={markdown}
          isDark={isDark}
          previewStyle={settings?.previewStyle}
          onNotification={showNotification}
          tabs={tabs}
          activeTabId={activeTabId}
        />

        {/* AI Assistant Button */}
        {onOpenAI && (
          <button
            onClick={onOpenAI}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
              isDark
                ? "bg-purple-700 hover:bg-purple-600 active:bg-purple-500"
                : "bg-purple-500 hover:bg-purple-600 active:bg-purple-700"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""} text-white`}
            title="Open Gemini AI Assistant"
            aria-label="Open Gemini AI Assistant"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onOpenAI();
              }
            }}
          >
            <SparklesIcon
              className="w-4 h-4 sm:w-5 sm:h-5"
              aria-hidden="true"
            />
            <span className="hidden sm:inline text-sm sm:text-base">
              AI Assistant
            </span>
          </button>
        )}

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
          aria-live="polite"
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
            <CheckCircleIcon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <XCircleIcon className="w-5 h-5" aria-hidden="true" />
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
  onOpenAI: PropTypes.func,
  settings: PropTypes.object,
  tabs: PropTypes.array,
  activeTabId: PropTypes.string,
};

export default Toolbar;