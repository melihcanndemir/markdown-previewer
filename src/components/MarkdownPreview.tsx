import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { EditorSettings, FONT_SIZES } from "../types"; // Corrected path

// Define types for component props
interface MarkdownPreviewProps {
  markdown: string;
  isDark: boolean;
  settings: EditorSettings; // Use the full shared settings type
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ 
  markdown, 
  isDark, 
  settings, 
  isFullScreen = false, 
  onFullScreenToggle = () => {} 
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preview = previewRef.current;
    if (preview) {
      preview.style.height = settings.editorHeight === "auto" ? "auto" : `${settings.editorHeight}px`;
    }
  }, [markdown, settings.editorHeight]);

  return (
    <div className={`
      rounded-lg
      ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}
      p-4 shadow-xl flex flex-col
    `}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${
          isDark ? "text-purple-400" : "text-purple-600"
        }`}>
          Preview
        </h2>

        <button
          onClick={onFullScreenToggle}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
            isDark
              ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
              : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
          }`}
          aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
          title={isFullScreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullScreen ? (
            <ArrowsPointingInIcon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ArrowsPointingOutIcon className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Preview Content */}
      <div
        ref={previewRef}
        className={`flex-grow w-full rounded-lg overflow-auto prose
        ${isDark ? "prose-invert bg-slate-900/50" : "bg-slate-50"}
        ${FONT_SIZES[settings.fontSize]} max-w-none p-6`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default MarkdownPreview;
