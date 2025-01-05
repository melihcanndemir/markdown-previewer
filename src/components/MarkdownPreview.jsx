import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from "prop-types";
import { FONT_SIZES, PREVIEW_STYLES } from "./Settings";

function MarkdownPreview({ markdown, isDark, settings }) {
  return (
    <div
      className={`
        rounded-lg
        ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}
        p-4 shadow-xl
        // Burada da overflow-auto ekleyebilirsin, istersen
      `}
    >
      <h2
        className={`
          text-xl font-semibold mb-4
          ${isDark ? "text-purple-400" : "text-purple-600"}
        `}
      >
        Preview
      </h2>

      {/* İçerik kapsayıcısı */}
      <div
        className={`
          prose
          max-w-none
          ${isDark ? "prose-invert" : ""}
          ${PREVIEW_STYLES[settings.previewStyle]}
          whitespace-pre-wrap
          // İçerik uzayabilsin, kaydırılabilsin
          overflow-auto
        `}
        style={{
          fontSize: FONT_SIZES[settings.fontSize],
          // Çok büyük içeriklerde kısmen ekrana sığması için maxHeight kullanabilirsin
          // maxHeight: "80vh"
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Kod bloklarına özel bir render ekliyoruz
            code({ inline, className, children, ...props }) {
              return inline ? (
                <code
                  className={`bg-slate-700 text-slate-100 px-1 py-0.5 rounded ${className}`}
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <pre
                  className={`
                    bg-slate-700
                    text-slate-100
                    p-3
                    rounded-md
                    overflow-auto
                  `}
                  {...props}
                >
                  <code className="whitespace-pre">{children}</code>
                </pre>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

MarkdownPreview.propTypes = {
  markdown: PropTypes.string.isRequired,
  isDark: PropTypes.bool,
  settings: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
    previewStyle: PropTypes.string.isRequired,
  }).isRequired,
};

export default MarkdownPreview;
