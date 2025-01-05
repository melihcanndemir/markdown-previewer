import { useState, useEffect, useCallback } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import Toolbar from "./components/Toolbar";
import Settings from "./components/Settings";
import {
  SunIcon,
  MoonIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const DEFAULT_MARKDOWN = "# Welcome!\n\nWrite markdown here...";

function App() {
  // State Management with localStorage
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem("markdown-content");
    return saved || DEFAULT_MARKDOWN;
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("markdown-theme");
    return saved ? JSON.parse(saved) : true;
  });

  const [isFullScreen, setIsFullScreen] = useState(false);

  // Hamburger Menüsü için eklenen state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [orientation, setOrientation] = useState(
    window.screen.orientation?.type || "portrait"
  );

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("markdown-settings");
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: "medium",
          previewStyle: "default",
          showLineNumbers: true,
          autoSave: true,
          editorHeight: "auto",
          syncScroll: true,
        };
  });

  // Responsive Layout Management
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
    if (window.screen.orientation) {
      setOrientation(window.screen.orientation.type);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener("change", handleResize);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener("change", handleResize);
      }
    };
  }, [handleResize]);

  // LocalStorage Effects
  useEffect(() => {
    localStorage.setItem("markdown-content", markdown);
  }, [markdown]);

  useEffect(() => {
    localStorage.setItem("markdown-theme", JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("markdown-settings", JSON.stringify(settings));
  }, [settings]);

  // Auto-save Effect
  useEffect(() => {
    if (settings.autoSave) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("markdown-content", markdown);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [markdown, settings.autoSave]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            localStorage.setItem("markdown-content", markdown);
            break;
          case "b":
            e.preventDefault();
            setIsFullScreen((prev) => !prev);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [markdown]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark
          ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-slate-100 to-white text-slate-900"
      } transition-colors duration-200`}
    >
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6 max-w-[1440px] relative">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="w-8 h-8 sm:w-10 sm:h-10"
                aria-label="Markdown Previewer Logo"
              >
                <rect
                  width="100"
                  height="100"
                  rx="20"
                  fill={isDark ? "#1e293b" : "#f1f5f9"}
                />
                <path d="M30 25h40v10H30z" fill="#a855f7" />
                <path d="M30 40h40v10H30z" fill="#a855f7" />
                <path d="M30 55h40v10H30z" fill="#a855f7" />
                <rect
                  x="22.5"
                  y="22.5"
                  width="55"
                  height="55"
                  rx="15"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="5"
                />
              </svg>
              <h1
                className={`text-xl sm:text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                  isDark
                    ? "from-purple-400 to-pink-600"
                    : "from-purple-600 to-pink-800"
                }`}
              >
                Markdown Previewer
              </h1>
            </div>

            {/* Mobilde hamburger menü butonu */}
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
                    : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
                } ml-auto`}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            )}
          </div>

          {/* Toolbar & Settings (masaüstü görünümde her zaman, mobilde hamburger menüye bağlı) */}
          {!isMobile && (
            <div className="flex flex-nowrap items-center gap-2 sm:gap-4 justify-end w-full sm:w-auto">
              <Toolbar
                markdown={markdown}
                setMarkdown={setMarkdown}
                isDark={isDark}
                isMobile={isMobile}
              />
              <div className="hidden sm:block h-6 w-px bg-slate-600/50" />
              <Settings
                isDark={isDark}
                settings={settings}
                onSettingsChange={setSettings}
                isMobile={isMobile}
                orientation={orientation}
              />

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
                    : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
                }`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
                    : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
                }`}
                title={isFullScreen ? "Exit full screen" : "Enter full screen"}
                aria-label={
                  isFullScreen ? "Exit full screen" : "Enter full screen"
                }
              >
                {isFullScreen ? (
                  <ArrowsPointingInIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <ArrowsPointingOutIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* M O B I L   M E N Ü */}
        {isMobile && isMenuOpen && (
          <div
            className={`flex flex-col gap-3 mb-4 ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            } p-4 rounded-lg`}
          >
            {/* Panel Başlığı ve Kapat Butonu */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Quick Actions</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
                    : "bg-slate-300 hover:bg-slate-400 active:bg-slate-500"
                }`}
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <hr
              className={`border-1 ${
                isDark ? "border-slate-700" : "border-slate-300"
              }`}
            />

            {/* EDITOR TOOLS */}
            <div className="flex flex-col gap-2">
              <span className="font-medium text-base">Editor Tools</span>
              <Toolbar
                markdown={markdown}
                setMarkdown={setMarkdown}
                isDark={isDark}
                isMobile={isMobile}
              />
            </div>

            <hr
              className={`border-1 ${
                isDark ? "border-slate-700" : "border-slate-300"
              }`}
            />

            {/* SETTINGS */}
            <div className="flex flex-col gap-2">
              <span className="font-medium text-base">Settings</span>
              <Settings
                isDark={isDark}
                settings={settings}
                onSettingsChange={setSettings}
                isMobile={isMobile}
                orientation={orientation}
              />
            </div>

            <hr
              className={`border-1 ${
                isDark ? "border-slate-700" : "border-slate-300"
              }`}
            />

            {/* DİĞER BUTONLAR */}
            <div className="flex gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`flex items-center justify-center p-2 w-full rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
                    : "bg-slate-300 hover:bg-slate-400 active:bg-slate-500"
                }`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDark ? (
                  <>
                    <SunIcon className="w-5 h-5 mr-1" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-5 h-5 mr-1" />
                    Dark Mode
                  </>
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`flex items-center justify-center p-2 w-full rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
                    : "bg-slate-300 hover:bg-slate-400 active:bg-slate-500"
                }`}
                title={isFullScreen ? "Exit full screen" : "Enter full screen"}
                aria-label={
                  isFullScreen ? "Exit full screen" : "Enter full screen"
                }
              >
                {isFullScreen ? (
                  <>
                    <ArrowsPointingInIcon className="w-5 h-5 mr-1" />
                    Exit Full
                  </>
                ) : (
                  <>
                    <ArrowsPointingOutIcon className="w-5 h-5 mr-1" />
                    Full Screen
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div
          className={`grid gap-3 sm:gap-4 md:gap-6 ${
            isFullScreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {!isFullScreen && (
            <MarkdownEditor
              markdown={markdown}
              setMarkdown={setMarkdown}
              isDark={isDark}
              settings={settings}
              isMobile={isMobile}
            />
          )}
          <MarkdownPreview
            markdown={markdown}
            isDark={isDark}
            settings={settings}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`mt-4 py-4 sm:py-6 ${
          isDark ? "bg-slate-900/50" : "bg-white/50"
        } backdrop-blur-sm border-t ${
          isDark ? "border-slate-800" : "border-slate-200"
        } transition-colors duration-200`}
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <span
                className={`${isDark ? "text-slate-400" : "text-slate-600"}`}
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
                className={`${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                by
              </span>
              <a
                href="https://github.com/melihcanndemir"
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
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-medium text-sm sm:text-base">
                  View on GitHub
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
