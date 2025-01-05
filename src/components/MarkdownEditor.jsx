import PropTypes from "prop-types";
import { FONT_SIZES } from './Settings';
import { useRef, useEffect, useState } from 'react';

function MarkdownEditor({ markdown, setMarkdown, isDark, settings }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState(1);

  // Sync scroll between textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    const handleScroll = () => {
      if (lineNumbers) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
      
      // Calculate visible lines
      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
      const visibleHeight = textarea.clientHeight;
      const scrollTop = textarea.scrollTop;
      const totalVisibleLines = Math.ceil((visibleHeight + scrollTop) / lineHeight);
      setVisibleLines(totalVisibleLines);
    };

    textarea.addEventListener('scroll', handleScroll);
    textarea.addEventListener('input', handleScroll);
    
    // Initial calculation
    handleScroll();

    return () => {
      textarea.removeEventListener('scroll', handleScroll);
      textarea.removeEventListener('input', handleScroll);
    };
  }, []);

  return (
    <div
      className={`rounded-lg ${
        isDark ? "bg-slate-800" : "bg-white border border-slate-200"
      } p-4 shadow-xl`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          isDark ? "text-purple-400" : "text-purple-600"
        }`}
      >
        Editor
      </h2>
      <div className="relative">
        {settings.showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className={`absolute left-0 top-4 bottom-4 px-2 text-right select-none overflow-hidden ${
              isDark ? "bg-slate-900/50 text-slate-500" : "bg-slate-100 text-slate-400"
            }`}
            style={{ 
              width: '3em',
              borderRight: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
              fontSize: FONT_SIZES[settings.fontSize],
            }}
          >
            {Array.from({ length: Math.max(markdown.split('\n').length, visibleLines) }, (_, i) => (
              <div key={i} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className={`w-full h-[500px] rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
            isDark ? "bg-slate-900 text-gray-100" : "bg-slate-50 text-slate-900"
          }`}
          style={{
            fontSize: FONT_SIZES[settings.fontSize],
            padding: settings.showLineNumbers ? '1rem 1rem 1rem 4em' : '1rem',
            lineHeight: '1.5',
          }}
          placeholder="Write Markdown..."
        />
      </div>
    </div>
  );
}

MarkdownEditor.propTypes = {
  markdown: PropTypes.string.isRequired,
  setMarkdown: PropTypes.func.isRequired,
  isDark: PropTypes.bool,
  settings: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
    showLineNumbers: PropTypes.bool.isRequired,
  }).isRequired,
};

export default MarkdownEditor;