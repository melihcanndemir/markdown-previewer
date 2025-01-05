import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropTypes from "prop-types";
import { FONT_SIZES, PREVIEW_STYLES } from "./Settings";

function MarkdownPreview({ markdown, isDark, settings }) {
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
        Preview
      </h2>
      <div
        className={`prose max-w-none ${isDark ? "prose-invert" : ""} ${
          PREVIEW_STYLES[settings.previewStyle]
        }`}
        style={{
          fontSize: FONT_SIZES[settings.fontSize],
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
