import React from "react";
import { useSettingsStore } from "../store/settingsStore";

// Define an interface for the component's props - No props needed anymore
interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  // Get theme from Zustand store
  const { isDark } = useSettingsStore();
  return (
    <footer
      className={`mt-auto py-4 ${
        isDark ? "bg-slate-900/50" : "bg-white/50"
      } backdrop-blur-sm border-t ${
        isDark ? "border-slate-800" : "border-slate-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>
              Made with
            </span>
            <span 
              role="img" 
              aria-label="heart" 
              className="text-red-500 animate-pulse"
            >
              ❤️
            </span>
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>
              by
            </span>
          </div>
          <div className="flex items-center gap-2">
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
            <a
              href="https://github.com/melihcanndemir/markdown-previewer"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="inline-block"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 