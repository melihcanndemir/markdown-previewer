import React, { useRef, useEffect, useCallback } from "react";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { EditorSettings, FONT_SIZES } from "../types"; // Corrected path

// Type definitions for component props
interface MarkdownToolbarProps {
  isDark: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (value: string) => void;
}

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
  settings: EditorSettings;
  isFullScreen: boolean;
  onFullScreenToggle: () => void;
}

// Markdown Toolbar Component
const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ isDark, textareaRef, onChange }) => {
  const buttonClass = `p-1.5 rounded-lg transition-colors duration-200 ${
    isDark
      ? "hover:bg-slate-700 active:bg-slate-600"
      : "hover:bg-slate-200 active:bg-slate-300"
  }`;

  const insertFormat = useCallback(
    (prefix: string, suffix: string = prefix) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      const before = text.substring(0, start);
      const selection = text.substring(start, end);
      const after = text.substring(end);

      const alreadyFormatted =
        selection.startsWith(prefix) && selection.endsWith(suffix);

      if (alreadyFormatted) {
        const unformattedSelection = selection.slice(
          prefix.length,
          selection.length - suffix.length
        );
        const newText = before + unformattedSelection + after;

        onChange(newText);
        const newEndPos = start + unformattedSelection.length;
        textarea.setSelectionRange(start, newEndPos);
      } else {
        const lineStart = before.lastIndexOf("\n") + 1;
        const isStartOfLine = lineStart === before.length;

        let finalPrefix = prefix;
        if (prefix.endsWith(" ") && !isStartOfLine && !before.endsWith("\n")) {
          finalPrefix = "\n" + prefix;
        }

        const newText = before + finalPrefix + selection + suffix + after;
        onChange(newText);

        const newStartPos = start + finalPrefix.length;
        const newEndPos = end + finalPrefix.length;
        textarea.setSelectionRange(newStartPos, newEndPos);
      }

      setTimeout(() => textarea.focus(), 0);
    },
    [textareaRef, onChange]
  );

  const handleClick = useCallback(
    (prefix: string, suffix: string = prefix) => {
      insertFormat(prefix, suffix);
    },
    [insertFormat]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  }, []);

  return (
    <div
      role="toolbar"
      aria-label="Markdown formatting tools"
      className={`flex flex-wrap gap-1 mb-2 p-2 rounded-lg ${
        isDark ? "bg-slate-900/50" : "bg-slate-100"
      }`}
    >
      {/* Heading buttons */}
      <button
        className={buttonClass}
        onClick={() => handleClick("# ", "")}
        aria-label="Add heading level 1"
        title="Heading 1"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("# ", ""))}
      >
        H1
      </button>

      <button
        className={buttonClass}
        onClick={() => handleClick("## ", "")}
        aria-label="Add heading level 2"
        title="Heading 2"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("## ", ""))}
      >
        H2
      </button>

      {/* Text formatting buttons */}
      <button
        className={buttonClass}
        onClick={() => handleClick("**")}
        aria-label="Make text bold"
        title="Bold"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("**"))}
      >
        <strong>B</strong>
      </button>

      <button
        className={buttonClass}
        onClick={() => handleClick("*")}
        aria-label="Make text italic"
        title="Italic"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("*"))}
      >
        <em>I</em>
      </button>

      <button
        className={buttonClass}
        onClick={() => handleClick("~~")}
        aria-label="Strike through text"
        title="Strikethrough"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("~~"))}
      >
        <s>S</s>
      </button>

      {/* Link and image buttons */}
      <button
        className={buttonClass}
        onClick={() => handleClick("[", "](url)")}
        aria-label="Insert link"
        title="Link"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("[", "](url)"))}
      >
        Link
      </button>

      <button
        className={buttonClass}
        onClick={() => handleClick("![", "](url)")}
        aria-label="Insert image"
        title="Image"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("![", "](url)"))}
      >
        Img
      </button>

      {/* Code formatting buttons */}
      <button
        className={buttonClass}
        onClick={() => handleClick("`")}
        aria-label="Insert inline code"
        title="Inline Code"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("`"))}
      >
        Code
      </button>

      <button
        className={buttonClass}
        onClick={() => handleClick("\n```\n", "\n```")}
        aria-label="Insert code block"
        title="Code Block"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("\n```\n", "\n```"))}
      >
        Block
      </button>

      {/* List and quote buttons */}
      <button
        className={buttonClass}
        onClick={() => handleClick("> ", "")}
        aria-label="Insert quote"
        title="Quote"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("> ", ""))}
      >
        &gt;
      </button>

      <button
        className={buttonClass}
        onClick={() => handleClick("- ", "")}
        aria-label="Insert bullet list"
        title="Bullet List"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("- ", ""))}
      >
        •
      </button>

      <button
        className={buttonClass}
        onClick={() => handleClick("1. ", "")}
        aria-label="Insert numbered list"
        title="Numbered List"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick("1. ", ""))}
      >
        1.
      </button>

      {/* Table button */}
      <button
        className={buttonClass}
        onClick={() =>
          handleClick(
            "| Header 1 | Header 2 |\n|------------|------------|\n| Content 1 | Content 2 |",
            ""
          )
        }
        aria-label="Insert table"
        title="Insert Table"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, () => handleClick(
          "| Header 1 | Header 2 |\n|------------|------------|\n| Content 1 | Content 2 |",
          ""
        ))}
      >
        Table
      </button>
    </div>
  );
};

// Editor Component
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  isDark,
  settings,
  isFullScreen,
  onFullScreenToggle,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (textarea && lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener("scroll", handleScroll);
    textarea.addEventListener("input", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      textarea.removeEventListener("scroll", handleScroll);
      textarea.removeEventListener("input", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  const scrollbarClasses = isDark
    ? "scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500"
    : "scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400";

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = settings.editorHeight === "auto" ? "auto" : `${settings.editorHeight}px`;
      if (settings.editorHeight === "auto") {
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, [value, settings.editorHeight]);

  return (
    <div
      className={`
        rounded-lg
        ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}
        p-4 shadow-xl flex flex-col
      `}
      role="region"
      aria-label="Markdown editor"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`}
        >
          Editor
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
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFullScreenToggle();
            }
          }}
        >
          {isFullScreen ? (
            <ArrowsPointingInIcon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ArrowsPointingOutIcon className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Show Toolbar if enabled */}
      {settings.showToolbar && (
        <MarkdownToolbar
          isDark={isDark}
          textareaRef={textareaRef}
          onChange={onChange}
        />
      )}

      {/* Editor Area */}
      <div className="flex-grow relative">
        {settings.showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className={`absolute left-0 top-0 h-full select-none font-mono ${
              isDark
                ? "bg-slate-900/50 text-slate-500"
                : "bg-slate-100 text-slate-400"
            }`}
            style={{
              width: "3em",
              borderRight: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
              fontSize: FONT_SIZES[settings.fontSize],
              lineHeight: "2.2rem",
              padding: "0.5rem 0",
              overflow: "auto",
            }}
            aria-hidden="true"
          >
            {value.split("\n").map((_, idx: number) => (
              <div
                key={idx}
                style={{
                  paddingRight: "0.2rem",
                  paddingLeft: "0.2rem",
                  textAlign: "center",
                  height: "2.2rem",
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full min-h-full outline-none rounded-lg font-mono resize-none ${
            isDark ? "bg-slate-900 text-gray-100" : "bg-slate-50 text-slate-900"
          } focus:ring-2 focus:ring-purple-500 ${scrollbarClasses}`}
          style={{
            fontSize: FONT_SIZES[settings.fontSize],
            lineHeight: "2.2rem",
            padding: settings.showLineNumbers
              ? "0.5rem 0.5rem 0.5rem 3.2em"
              : "0.5rem",
            height: `${Math.max(value.split("\n").length * 35.2 + 32, 200)}px`,
          }}
          spellCheck="false"
          placeholder="Write your markdown here..."
          aria-label="Markdown editor textarea"
          role="textbox"
          aria-multiline="true"
        />
      </div>
    </div>
  );
}

export default MarkdownEditor;