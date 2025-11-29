import { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { FONT_SIZES } from "./constants";

// Markdown Toolbar Component
const MarkdownToolbar = ({ isDark, textareaRef, setMarkdown }) => {
  const buttonClass = `p-1.5 rounded-lg transition-colors duration-200 ${
    isDark
      ? "hover:bg-slate-700 active:bg-slate-600"
      : "hover:bg-slate-200 active:bg-slate-300"
  }`;

  const insertFormat = useCallback(
    (prefix, suffix = prefix) => {
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

        setMarkdown(newText);
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
        setMarkdown(newText);

        const newStartPos = start + finalPrefix.length;
        const newEndPos = end + finalPrefix.length;
        textarea.setSelectionRange(newStartPos, newEndPos);
      }

      setTimeout(() => textarea.focus(), 0);
    },
    [textareaRef, setMarkdown]
  );

  const handleClick = useCallback(
    (prefix, suffix = prefix) => {
      insertFormat(prefix, suffix);
    },
    [insertFormat]
  );

  const handleKeyDown = useCallback((e, callback) => {
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

MarkdownToolbar.propTypes = {
  isDark: PropTypes.bool.isRequired,
  textareaRef: PropTypes.object.isRequired,
  setMarkdown: PropTypes.func.isRequired,
};

// Editor Component
function MarkdownEditor({
  markdown,
  setMarkdown,
  isDark,
  settings,
  isFullScreen,
  onFullScreenToggle,
  editorScrollRef,
  previewScrollRef,
  isScrollingRef,
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Smart auto-completion pairs
  const completionPairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
    "'": "'",
    '`': '`',
    '*': '*',
    '_': '_',
  };

  const handleKeyDown = useCallback((e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const charBefore = value[selectionStart - 1];
    const charAfter = value[selectionStart];

    // Auto-close brackets, quotes, etc.
    if (completionPairs[e.key] && !selectedText) {
      // Don't auto-complete if next char is the same (avoid duplicates)
      if (charAfter === completionPairs[e.key]) {
        return;
      }

      e.preventDefault();
      const pair = e.key + completionPairs[e.key];
      const newValue = value.substring(0, selectionStart) + pair + value.substring(selectionEnd);
      setMarkdown(newValue);

      setTimeout(() => {
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = selectionStart + 1;
      }, 0);
      return;
    }

    // Wrap selected text with pairs
    if (completionPairs[e.key] && selectedText) {
      e.preventDefault();
      const wrapped = e.key + selectedText + completionPairs[e.key];
      const newValue = value.substring(0, selectionStart) + wrapped + value.substring(selectionEnd);
      setMarkdown(newValue);

      setTimeout(() => {
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = selectionEnd + 1;
      }, 0);
      return;
    }

    // Auto-continue lists on Enter
    if (e.key === 'Enter') {
      const lines = value.substring(0, selectionStart).split('\n');
      const currentLine = lines[lines.length - 1];

      // Unordered list continuation
      const unorderedMatch = currentLine.match(/^(\s*)([-*+])\s/);
      if (unorderedMatch) {
        e.preventDefault();
        const indent = unorderedMatch[1];
        const bullet = unorderedMatch[2];
        const newLine = `\n${indent}${bullet} `;
        const newValue = value.substring(0, selectionStart) + newLine + value.substring(selectionEnd);
        setMarkdown(newValue);

        setTimeout(() => {
          const newPos = selectionStart + newLine.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
        }, 0);
        return;
      }

      // Ordered list continuation
      const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
      if (orderedMatch) {
        e.preventDefault();
        const indent = orderedMatch[1];
        const nextNum = parseInt(orderedMatch[2]) + 1;
        const newLine = `\n${indent}${nextNum}. `;
        const newValue = value.substring(0, selectionStart) + newLine + value.substring(selectionEnd);
        setMarkdown(newValue);

        setTimeout(() => {
          const newPos = selectionStart + newLine.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
        }, 0);
        return;
      }
    }

    // Skip closing bracket if cursor is before it
    if (e.key === ')' || e.key === ']' || e.key === '}') {
      if (charAfter === e.key) {
        e.preventDefault();
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = selectionStart + 1;
        return;
      }
    }
  }, [setMarkdown]);

  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (textarea && lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }

    // Sync scroll with preview if enabled
    if (settings.syncScroll && !isScrollingRef.current && previewScrollRef?.current) {
      isScrollingRef.current = true;
      
      // Calculate scroll percentage
      const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
      
      // Apply to preview
      const previewElement = previewScrollRef.current;
      const maxScroll = previewElement.scrollHeight - previewElement.clientHeight;
      previewElement.scrollTop = scrollPercentage * maxScroll;
      
      // Reset flag after a short delay
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 50);
    }
  }, [settings.syncScroll, previewScrollRef, isScrollingRef]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Store ref for sync scrolling
    if (editorScrollRef) {
      editorScrollRef.current = textarea;
    }

    textarea.addEventListener("scroll", handleScroll);
    textarea.addEventListener("input", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      textarea.removeEventListener("scroll", handleScroll);
      textarea.removeEventListener("input", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll, editorScrollRef]);

  const scrollbarClasses = isDark
    ? "scrollbar-modern-dark"
    : "scrollbar-modern";

  // Calculate dynamic line number width based on line count
  const lineCount = markdown.split("\n").length;
  const digits = String(lineCount).length;
  const lineNumberWidth = `${Math.max(2.5, 1.5 + digits * 0.6)}em`;
  const textareaPaddingLeft = `${Math.max(3, 2 + digits * 0.6)}em`;

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
          setMarkdown={setMarkdown}
        />
      )}

      {/* Editor Area */}
      <div className="flex-grow relative -mx-4 px-4">
        {settings.showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className={`absolute top-0 h-full select-none font-mono ${
              isDark
                ? "bg-slate-900/50 text-slate-500 scrollbar-modern-dark"
                : "bg-slate-100 text-slate-400 scrollbar-modern"
            }`}
            style={{
              left: 0,
              width: lineNumberWidth,
              borderRight: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
              fontSize: FONT_SIZES[settings.fontSize],
              lineHeight: "1.5rem",
              padding: "0.75rem 0",
              overflow: "auto",
            }}
            aria-hidden="true"
          >
            {markdown.split("\n").map((_, idx) => (
              <div
                key={idx}
                style={{
                  paddingRight: "0.5rem",
                  textAlign: "right",
                  height: "1.5rem",
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full min-h-full outline-none rounded-lg font-mono resize-none ${
            isDark ? "bg-slate-900 text-gray-100" : "bg-slate-50 text-slate-900"
          } focus:ring-2 focus:ring-purple-500 ${scrollbarClasses}`}
          style={{
            fontSize: FONT_SIZES[settings.fontSize],
            lineHeight: "1.5rem",
            padding: settings.showLineNumbers
              ? `0.75rem 0.75rem 0.75rem ${textareaPaddingLeft}`
              : "0.75rem",
            height: `${Math.max(markdown.split("\n").length * 24 + 48, 200)}px`,
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

MarkdownEditor.propTypes = {
  markdown: PropTypes.string.isRequired,
  setMarkdown: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  settings: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
    showLineNumbers: PropTypes.bool.isRequired,
    showToolbar: PropTypes.bool.isRequired,
    editorHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    syncScroll: PropTypes.bool,
  }).isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  onFullScreenToggle: PropTypes.func.isRequired,
  editorScrollRef: PropTypes.object,
  previewScrollRef: PropTypes.object,
  isScrollingRef: PropTypes.object,
};

export default MarkdownEditor;