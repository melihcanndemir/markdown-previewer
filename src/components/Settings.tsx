import React from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EditorSettings } from '../types'; // Corrected path
import { useSettingsStore } from '../store/settingsStore';

// Define an interface for the component's props
interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  // Get state and actions from Zustand store
  const { isDark, settings, setSettings } = useSettingsStore();
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className={`relative w-full max-w-sm mx-4 p-6 rounded-xl shadow-2xl ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors duration-200 ${
              isDark
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-slate-200 hover:bg-slate-300"
            }`}
            aria-label="Close settings"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Font Size */}
          <div>
            <label className="block mb-1.5 text-sm font-medium">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => setSettings({ fontSize: e.target.value as EditorSettings['fontSize'] })}
              className={`w-full p-1.5 text-sm rounded-lg ${
                isDark
                  ? "bg-slate-700 text-white border-slate-600"
                  : "bg-white text-gray-900 border-gray-300"
              } border focus:ring-1 focus:ring-purple-500`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.showLineNumbers}
                onChange={(e) => setSettings({ showLineNumbers: e.target.checked })}
                className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
              />
              <span>Line Numbers</span>
            </label>

            <div className="flex items-center gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showToolbar}
                  onChange={(e) => setSettings({ showToolbar: e.target.checked })}
                  className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span>Toolbar</span>
              </label>
              <span className={`ml-auto px-2 py-0.5 text-xs rounded ${
                settings.showToolbar
                  ? "bg-purple-500/10 text-purple-500"
                  : "bg-slate-500/10 text-slate-500"
              }`}>
                {settings.showToolbar ? "On" : "Off"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
