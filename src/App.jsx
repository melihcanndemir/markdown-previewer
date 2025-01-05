import { useState, useEffect } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import Toolbar from "./components/Toolbar";
import Settings from "./components/Settings";
import {
  SunIcon,
  MoonIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";

// Default markdown content
const DEFAULT_MARKDOWN = "# Welcome!\n\nWrite markdown here...";

function App() {
  // Load initial state from localStorage or use defaults
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem("markdown-content");
    return saved || DEFAULT_MARKDOWN;
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("markdown-theme");
    return saved ? JSON.parse(saved) : true;
  });

  const [isFullScreen, setIsFullScreen] = useState(false);

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("markdown-settings");
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: "medium",
          previewStyle: "default",
          showLineNumbers: true,
          autoSave: true,
        };
  });

  // Save markdown content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("markdown-content", markdown);
  }, [markdown]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("markdown-theme", JSON.stringify(isDark));
  }, [isDark]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("markdown-settings", JSON.stringify(settings));
  }, [settings]);

  // Auto save effect
  useEffect(() => {
    if (settings.autoSave) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("markdown-content", markdown);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [markdown, settings.autoSave]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark
          ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-slate-100 to-white text-slate-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
              isDark
                ? "from-purple-400 to-pink-600"
                : "from-purple-600 to-pink-800"
            }`}
          >
            Markdown Previewer
          </h1>

          <div className="flex items-center gap-4">
            <Toolbar
              markdown={markdown}
              setMarkdown={setMarkdown}
              isDark={isDark}
            />
            <div className="h-6 w-px bg-slate-600/50" /> {/* Separator */}
            <Settings
              isDark={isDark}
              settings={settings}
              onSettingsChange={setSettings}
            />
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-200 hover:bg-slate-300"
              }`}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className={`p-2 rounded-lg ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-200 hover:bg-slate-300"
              }`}
              title={isFullScreen ? "Exit full screen" : "Enter full screen"}
            >
              {isFullScreen ? (
                <ArrowsPointingInIcon className="w-6 h-6" />
              ) : (
                <ArrowsPointingOutIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`grid gap-6 ${
            isFullScreen ? "grid-cols-1" : "md:grid-cols-2"
          }`}
        >
          {!isFullScreen && (
            <MarkdownEditor
              markdown={markdown}
              setMarkdown={setMarkdown}
              isDark={isDark}
              settings={settings}
            />
          )}
          <MarkdownPreview
            markdown={markdown}
            isDark={isDark}
            settings={settings}
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`py-6 ${
          isDark ? "bg-slate-900/50" : "bg-white/50"
        } backdrop-blur-sm border-t ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`text-base ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Made with
              </span>
              <span
                role="img"
                aria-label="heart"
                className="text-red-500 animate-pulse"
              >
                ❤️
              </span>
              <span
                className={`text-base ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                by
              </span>
              <a
                href="https://github.com/melihcandemir"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium transition-colors duration-200 ${
                  isDark
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-500"
                }`}
              >
                Melih Can Demir
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/melihcanndemir/markdown-previewer"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-medium">View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
