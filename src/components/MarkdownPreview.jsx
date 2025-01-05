import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from "prop-types";
import { FONT_SIZES, PREVIEW_STYLES } from "./Settings";

function MarkdownPreview({ markdown, isDark, settings }) {
  return (
    <div
      className={`rounded-lg ${
        isDark ? "bg-slate-800" : "bg-white border border-slate-200"
      } p-2 sm:p-4 shadow-xl`}
    >
      <h2
        className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-4 ${
          isDark ? "text-purple-400" : "text-purple-600"
        }`}
      >
        Preview
      </h2>
      <div
        className={`prose prose-sm sm:prose max-w-none ${
          isDark
            ? "prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-em:text-gray-100 prose-code:text-gray-100"
            : ""
        } ${PREVIEW_STYLES[settings.previewStyle]}`}
        style={{
          fontSize: FONT_SIZES[settings.fontSize],
          color: isDark ? "#ffffff" : "inherit",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
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
