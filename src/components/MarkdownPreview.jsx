import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from "prop-types";
import { FONT_SIZES, PREVIEW_STYLES } from "./constants";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";

function MarkdownPreview({
  markdown,
  isDark,
  settings,
  isFullScreen,
  onFullScreenToggle,
}) {
  // Get current theme (custom or preset)
  const isCustomTheme = settings.previewStyle === 'custom' && settings.customTheme;
  const baseTheme = isCustomTheme
    ? settings.customTheme
    : PREVIEW_STYLES[settings.previewStyle] || PREVIEW_STYLES.default;

  // Select appropriate colors based on dark mode (only for preset themes)
  const currentTheme = isCustomTheme ? {
    prose: baseTheme.prose,
    headingColor: baseTheme.headingColor,
    linkColor: baseTheme.linkColor,
    codeBackground: baseTheme.codeBackground,
    borderColor: baseTheme.borderColor,
  } : {
    prose: baseTheme.prose,
    headingColor: isDark ? baseTheme.headingColorDark : baseTheme.headingColor,
    linkColor: isDark ? baseTheme.linkColorDark : baseTheme.linkColor,
    codeBackground: isDark ? baseTheme.codeBackgroundDark : baseTheme.codeBackground,
    borderColor: isDark ? baseTheme.borderColorDark : baseTheme.borderColor,
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFullScreenToggle();
    }
  };

  return (
    <div
      className={`
        rounded-lg h-full
        ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}
        p-4 shadow-xl flex flex-col
      `}
      role="region"
      aria-label="Markdown preview"
    >
      <div className="flex justify-between items-center mb-2">
        <h2
          className={`
            text-xl font-semibold mb-2
            ${isDark ? "text-purple-400" : "text-purple-600"}
            flex-shrink-0
          `}
        >
          Preview
        </h2>
        <button
          onClick={onFullScreenToggle}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
            isDark
              ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
              : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
          }`}
          title={isFullScreen ? "Exit full screen" : "Enter full screen"}
          aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {isFullScreen ? (
            <ArrowsPointingInIcon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ArrowsPointingOutIcon className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        data-preview-content
        className={`
          prose
          max-w-none
          flex-grow
          overflow-auto
          ${isDark ? "prose-invert scrollbar-modern-dark" : "scrollbar-modern"}
          ${currentTheme.prose}
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
          '--heading-color': currentTheme.headingColor,
          '--link-color': currentTheme.linkColor,
          '--code-bg': currentTheme.codeBackground,
          '--border-color': currentTheme.borderColor,
        }}
        role="article"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Başlıklar için özel bileşen
            h1: ({ ...props }) => (
              <h1 className="mt-3 mb-2" {...props} tabIndex={0} style={{ color: currentTheme.headingColor }} />
            ),
            h2: ({ ...props }) => (
              <h2 className="mt-2 mb-1" {...props} tabIndex={0} style={{ color: currentTheme.headingColor }} />
            ),
            h3: ({ ...props }) => (
              <h3 className="mt-2 mb-1" {...props} tabIndex={0} style={{ color: currentTheme.headingColor }} />
            ),
            // Paragraflar için özel bileşen
            p: ({ children, ...props }) => (
              <p className="my-1" {...props} tabIndex={0}>
                {children}
              </p>
            ),
            // Listeler için özel bileşen
            ul: ({ ...props }) => (
              <ul className="my-1" role="list" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="my-1" role="list" {...props} />
            ),
            // Liste öğeleri için özel bileşen
            li: ({ ...props }) => (
              <li className="my-0" role="listitem" {...props} tabIndex={0} />
            ),
            // Kod blokları için özel bileşen
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  style={isDark ? oneDark : oneLight}
                  language={language}
                  PreTag="div"
                  role="code"
                  tabIndex={0}
                  aria-label={`Code block in ${language}`}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={className} role="code" tabIndex={0} style={{ backgroundColor: currentTheme.codeBackground }}>
                  {children}
                </code>
              );
            },
            // Alıntılar için özel bileşen
            blockquote: ({ ...props }) => (
              <blockquote
                className="my-2"
                {...props}
                role="blockquote"
                tabIndex={0}
              />
            ),
            // Tablolar için özel bileşen
            table: ({ ...props }) => (
              <table className="my-2" {...props} role="table" tabIndex={0} />
            ),
            thead: (props) => <thead {...props} role="rowgroup" />,
            tbody: (props) => <tbody {...props} role="rowgroup" />,
            tr: (props) => <tr {...props} role="row" />,
            th: (props) => (
              <th {...props} role="columnheader" scope="col" tabIndex={0} />
            ),
            td: (props) => <td {...props} role="cell" tabIndex={0} />,
            // Yatay çizgi için özel bileşen
            hr: ({ ...props }) => (
              <hr
                className="my-2"
                {...props}
                role="separator"
                aria-orientation="horizontal"
              />
            ),
            // Bağlantılar için özel bileşen
            a: ({ ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline focus:ring-2 focus:ring-purple-500 focus:outline-none"
                style={{ color: currentTheme.linkColor }}
              />
            ),
            // Görseller için özel bileşen
            img: ({ alt, ...props }) => (
              <img
                {...props}
                alt={alt || ""}
                role="img"
                tabIndex={0}
                className="rounded-lg shadow-md"
              />
            ),
          }}
          rehypePlugins={[rehypeRaw]}
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
  isFullScreen: PropTypes.bool.isRequired,
  onFullScreenToggle: PropTypes.func.isRequired,
};

export default MarkdownPreview;
