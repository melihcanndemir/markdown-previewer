import { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { FONT_SIZES } from "./constants";

// -------------------- MARKDOWN TOOLBAR COMPONENT --------------------
const MarkdownToolbar = ({ isDark, textareaRef, setMarkdown }) => {
  // Consolidated Tailwind styles for buttons
  const buttonClass = `p-1.5 rounded-lg transition-colors duration-200 ${
    isDark
      ? "hover:bg-slate-700 active:bg-slate-600"
      : "hover:bg-slate-200 active:bg-slate-300"
  }`;

  /**
   * insertFormat function
   * Formats text with prefix/suffix parameters.
   * For "single-side" formats like Headings, suffix=""
   * For "double-side" formats like Bold/Italic, suffix=prefix
   */
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

      // If selected text is already formatted => remove format
      const alreadyFormatted =
        selection.startsWith(prefix) && selection.endsWith(suffix);

      if (alreadyFormatted) {
        // Remove formatting
        const unformattedSelection = selection.slice(
          prefix.length,
          selection.length - suffix.length
        );
        const newText = before + unformattedSelection + after;

        setMarkdown(newText);

        // Adjust cursor position
        const newEndPos = start + unformattedSelection.length;
        textarea.setSelectionRange(start, newEndPos);
      } else {
        // Add format => prefix + selection + suffix
        // For heading-like formats that add at line start
        // handle "new line" logic if needed

        // Example check: if prefix ends with space and not at line start
        const lineStart = before.lastIndexOf("\n") + 1;
        const isStartOfLine = lineStart === before.length; // or lineStart === 0

        let finalPrefix = prefix;
        if (prefix.endsWith(" ") && !isStartOfLine && !before.endsWith("\n")) {
          // Go to line start if needed
          finalPrefix = "\n" + prefix;
        }

        const newText = before + finalPrefix + selection + suffix + after;
        setMarkdown(newText);

        // Set new position
        const newStartPos = start + finalPrefix.length;
        const newEndPos = end + finalPrefix.length;
        textarea.setSelectionRange(newStartPos, newEndPos);
      }

      // Focus back to textarea
      setTimeout(() => textarea.focus(), 0);
    },
    [textareaRef, setMarkdown]
  );

  // handleClick: simple wrapper that takes prefix and suffix parameters and calls insertFormat
  const handleClick = useCallback(
    (prefix, suffix = prefix) => {
      insertFormat(prefix, suffix);
    },
    [insertFormat]
  );

  return (
    <div
      className={`flex flex-wrap gap-1 mb-2 p-2 rounded-lg ${
        isDark ? "bg-slate-900/50" : "bg-slate-100"
      }`}
    >
      {/* Heading 1: Tek taraf ekleme, bu yüzden suffix = "" */}
      <button
        className={buttonClass}
        onClick={() => handleClick("# ", "")}
        title="Heading 1"
      >
        H1
      </button>

      {/* Heading 2: Tek taraf ekleme */}
      <button
        className={buttonClass}
        onClick={() => handleClick("## ", "")}
        title="Heading 2"
      >
        H2
      </button>

      {/* Bold: İki taraf ekleme => prefix=** suffix=** */}
      <button
        className={buttonClass}
        onClick={() => handleClick("**")}
        title="Bold"
      >
        <strong>B</strong>
      </button>

      {/* Italic: prefix = "*", suffix = "*" */}
      <button
        className={buttonClass}
        onClick={() => handleClick("*", "*")}
        title="Italic"
      >
        <em>I</em>
      </button>

      {/* Strikethrough: prefix="~~", suffix="~~" */}
      <button
        className={buttonClass}
        onClick={() => handleClick("~~")}
        title="Strikethrough"
      >
        <s>S</s>
      </button>

      {/* Link: "[", "](url)" */}
      <button
        className={buttonClass}
        onClick={() => handleClick("[", "](url)")}
        title="Link"
      >
        Link
      </button>

      {/* Image: "![", "](url)" */}
      <button
        className={buttonClass}
        onClick={() => handleClick("![", "](url)")}
        title="Image"
      >
        Img
      </button>

      {/* Inline code: prefix="`", suffix="`" */}
      <button
        className={buttonClass}
        onClick={() => handleClick("`")}
        title="Inline Code"
      >
        Code
      </button>

      {/* Code block: prefix="\n```\n", suffix="\n```" */}
      <button
        className={buttonClass}
        onClick={() => handleClick("\n```\n", "\n```")}
        title="Code Block"
      >
        Block
      </button>

      {/* Quote: Tek taraf ("> ") */}
      <button
        className={buttonClass}
        onClick={() => handleClick("> ", "")}
        title="Quote"
      >
        &gt;
      </button>

      {/* List: Tek taraf ("- ") */}
      <button
        className={buttonClass}
        onClick={() => handleClick("- ", "")}
        title="Bulleted List"
      >
        •
      </button>

      {/* Numbered list: Tek taraf ("1. ") */}
      <button
        className={buttonClass}
        onClick={() => handleClick("1. ", "")}
        title="Numbered List"
      >
        1.
      </button>

      {/* Table: Insert a chunk of text once */}
      <button
        className={buttonClass}
        onClick={() =>
          handleClick(
            "| Header 1 | Header 2 |\n|------------|------------|\n| Content 1 | Content 2 |",
            ""
          )
        }
        title="Insert Table"
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

// -------------------- EDITOR COMPONENT --------------------
function MarkdownEditor({
  markdown,
  setMarkdown,
  isDark,
  settings,
  isFullScreen,
  onFullScreenToggle,
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  /**
   * Synchronize textarea scroll with line numbers
   */
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

    // Initial sync
    handleScroll();

    // Cleanup
    return () => {
      textarea.removeEventListener("scroll", handleScroll);
      textarea.removeEventListener("input", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  // Tailwind scrollbar classes
  const scrollbarClasses = isDark
    ? "scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500"
    : "scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400";

  return (
    <div
      className={`
        rounded-lg
        ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}
        p-4 shadow-xl flex flex-col
      `}
      style={{ position: "relative" }}
    >
      {/* Header: Title + Expand Button */}
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
          title={isFullScreen ? "Collapse editor" : "Expand editor"}
        >
          {isFullScreen ? (
            <ArrowsPointingInIcon className="w-5 h-5" />
          ) : (
            <ArrowsPointingOutIcon className="w-5 h-5" />
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

      {/* Editor Area: Line numbers (optional) + textarea */}
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
              width: "3.5em",
              borderRight: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
              fontSize: FONT_SIZES[settings.fontSize],
              lineHeight: "1.5rem",
              padding: "0.75rem 0",
              overflow: "auto", // line numbers should also have scrollbar
            }}
          >
            {markdown.split("\n").map((_, idx) => (
              <div
                key={idx}
                style={{
                  paddingRight: "0.75rem",
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
          className={`w-full min-h-full outline-none rounded-lg font-mono resize-none ${
            isDark ? "bg-slate-900 text-gray-100" : "bg-slate-50 text-slate-900"
          } focus:ring-2 focus:ring-purple-500 ${scrollbarClasses}`}
          style={{
            fontSize: FONT_SIZES[settings.fontSize],
            lineHeight: "1.5rem",
            // Left padding 4em if line numbers enabled
            padding: settings.showLineNumbers
              ? "0.75rem 0.75rem 0.75rem 4em"
              : "0.75rem",
            // Simple auto height: line count * 24px + extra
            height: `${Math.max(markdown.split("\n").length * 24 + 48, 200)}px`,
          }}
          spellCheck="false"
          placeholder="Write your markdown here..."
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
  }).isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  onFullScreenToggle: PropTypes.func.isRequired,
};

export default MarkdownEditor;
