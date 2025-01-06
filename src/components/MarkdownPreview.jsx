import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from "prop-types";
import { FONT_SIZES, PREVIEW_STYLES } from "./Settings";

function MarkdownPreview({ markdown, isDark, settings }) {
  return (
    <div
      className={`
        rounded-lg h-full
        ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}
        p-4 shadow-xl flex flex-col
      `}
    >
      <h2
        className={`
          text-xl font-semibold mb-2
          ${isDark ? "text-purple-400" : "text-purple-600"}
          flex-shrink-0
        `}
      >
        Preview
      </h2>

      <div
        className={`
          prose
          max-w-none
          flex-grow
          overflow-auto
          ${isDark ? "prose-invert" : ""}
          ${PREVIEW_STYLES[settings.previewStyle]}
          [&>*:first-child]:mt-0
          [&>*:last-child]:mb-0
          [&_p]:my-1
          [&_h1]:mt-3 [&_h1]:mb-2
          [&_h2]:mt-2 [&_h2]:mb-1
          [&_h3]:mt-2 [&_h3]:mb-1
          [&_ul]:my-1
          [&_ol]:my-1
          [&_li]:my-0
          [&_pre]:my-2
          [&_blockquote]:my-2
          [&_table]:my-2
          [&_hr]:my-2
          [&_dl]:my-1
          [&_p_img]:my-2
          prose-headings:pb-0
          prose-p:mb-1
          prose-li:mt-0 prose-li:mb-0
          prose-blockquote:my-2
          prose-hr:my-2
          prose-table:my-2
          prose-pre:my-2
          prose-code:my-0
          [&_p:has(img)]:inline-flex
          [&_p:has(img)]:gap-2
          [&_p:has(img)]:flex-wrap
        `}
        style={{
          fontSize: FONT_SIZES[settings.fontSize],
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Başlıklar için özel bileşen
            h1: ({ node, ...props }) => (
              <h1 className="mt-3 mb-2" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="mt-2 mb-1" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="mt-2 mb-1" {...props} />
            ),
            // Paragraflar için özel bileşen
            p: ({ node, children, ...props }) => {
              // Eğer içerisinde img varsa
              const hasImage = node?.children?.some(child => child.type === 'image');
              return (
                <p className={`my-1 ${hasImage ? 'inline-flex gap-2 flex-wrap' : ''}`} {...props}>
                  {children}
                </p>
              );
            },
            // Listeler için özel bileşen
            ul: ({ node, ...props }) => (
              <ul className="my-1" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="my-1" {...props} />
            ),
            // Liste öğeleri için özel bileşen
            li: ({ node, ...props }) => (
              <li className="my-0" {...props} />
            ),
            // Kod blokları için özel bileşen
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
                  className="bg-slate-700 text-slate-100 p-3 rounded-md overflow-auto my-2"
                  {...props}
                >
                  <code className="whitespace-pre">{children}</code>
                </pre>
              );
            },
            // Alıntılar için özel bileşen
            blockquote: ({ node, ...props }) => (
              <blockquote className="my-2" {...props} />
            ),
            // Tablolar için özel bileşen
            table: ({ node, ...props }) => (
              <table className="my-2" {...props} />
            ),
            // Yatay çizgi için özel bileşen
            hr: ({ node, ...props }) => (
              <hr className="my-2" {...props} />
            ),
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