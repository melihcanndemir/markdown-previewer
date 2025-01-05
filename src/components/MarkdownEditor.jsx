import { useRef, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FONT_SIZES } from "./Settings";

function MarkdownEditor({ markdown, setMarkdown, isDark, settings, isMobile }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const containerRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  // Handle scroll synchronization
  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }

    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const visibleHeight = textarea.clientHeight;
    const scrollTop = textarea.scrollTop;
    const totalVisibleLines = Math.ceil((visibleHeight + scrollTop) / lineHeight);
    setVisibleLines(totalVisibleLines);
  }, []);

  // Initialize scroll handling
  useEffect(() => {
    const textarea = textareaRef.current;
    
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

  // Handle manual resizing
  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(containerRef.current.offsetHeight);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;

    const delta = e.clientY - startY;
    const newHeight = Math.max(200, startHeight + delta); // Minimum height of 200px
    containerRef.current.style.height = `${newHeight}px`;
  }, [isResizing, startY, startHeight]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Custom scrollbar styles with Tailwind classes
  const scrollbarClasses = isDark
    ? "scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500"
    : "scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400";

  return (
    <div
      ref={containerRef}
      className={`rounded-lg ${
        isDark ? "bg-slate-800" : "bg-white border border-slate-200"
      } p-2 sm:p-4 shadow-xl flex flex-col transition-colors duration-200 relative`}
      style={{ height: settings.editorHeight === 'auto' ? '100%' : settings.editorHeight }}
    >
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h2
          className={`text-lg sm:text-xl font-semibold ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`}
        >
          Editor
        </h2>
      </div>

      <div className="relative flex-grow overflow-hidden rounded-lg">
        {settings.showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className={`absolute left-0 top-0 h-full px-1 sm:px-2 text-right select-none overflow-hidden ${
              isDark
                ? "bg-slate-900/50 text-slate-500"
                : "bg-slate-100 text-slate-400"
            } transition-colors duration-200`}
            style={{
              width: "2.5em",
              borderRight: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
              fontSize: FONT_SIZES[settings.fontSize],
            }}
          >
            {Array.from(
              { length: Math.max(markdown.split("\n").length, visibleLines) },
              (_, i) => (
                <div key={i} className="leading-relaxed">
                  {i + 1}
                </div>
              )
            )}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className={`w-full h-full outline-none rounded-lg transition-all duration-200 ${
            isDark ? "bg-slate-900 text-gray-100" : "bg-slate-50 text-slate-900"
          } ${scrollbarClasses} focus:ring-2 focus:ring-purple-500`}
          style={{
            fontSize: FONT_SIZES[settings.fontSize],
            padding: settings.showLineNumbers
              ? "0.75rem 0.75rem 0.75rem 3em"
              : "0.75rem",
            lineHeight: "1.5",
            resize: settings.editorHeight === 'auto' ? 'none' : 'vertical',
            minHeight: isMobile ? '200px' : '300px',
          }}
          spellCheck="false"
          placeholder="Write your markdown here..."
        />
      </div>

      {settings.editorHeight === 'auto' && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize ${
            isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'
          } rounded-b-lg transition-colors duration-200`}
          onMouseDown={handleMouseDown}
        />
      )}
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
    editorHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
  }).isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default MarkdownEditor;