import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import EditorPage from "./pages/EditorPage";
import Footer from "./components/Footer";
import {
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useSettingsStore } from "./store/settingsStore";

function App(): JSX.Element {
  // Get theme from Zustand store
  const { isDark, toggleTheme } = useSettingsStore();

  // Settings visibility state (this remains local as it's UI-only state)
  const [showSettings, setShowSettings] = useState<boolean>(false);

  return (
    <Router>
      <div
        className={`min-h-screen flex flex-col ${
          isDark
            ? "dark bg-gradient-to-br from-slate-900 to-slate-800 text-white"
            : "bg-gradient-to-br from-slate-100 to-white text-slate-900"
        } transition-colors duration-200`}
      >
        {/* Header */}
        <header className="border-b border-slate-700/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  className="w-8 h-8"
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
                  className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                    isDark
                      ? "from-purple-400 to-pink-600"
                      : "from-purple-600 to-pink-800"
                  }`}
                >
                  Markdown Previewer
                </h1>
              </Link>

              {/* Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDark ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </button>

                <Routes>
                  <Route
                    path="/edit/:noteId"
                    element={
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isDark
                            ? "bg-slate-700 hover:bg-slate-600"
                            : "bg-slate-200 hover:bg-slate-300"
                        }`}
                        title="Settings"
                        aria-label="Settings"
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                      </button>
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<NotesPage />} />
            <Route
              path="/edit/:noteId"
              element={
                <EditorPage
                  showSettings={showSettings}
                  onSettingsVisibilityChange={setShowSettings}
                />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
