import { useState } from 'react';
import PropTypes from 'prop-types';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const FONT_SIZES = {
  small: '14px',
  medium: '16px',
  large: '18px',
};

const PREVIEW_STYLES = {
  default: 'prose-slate',
  github: 'prose-neutral',
  elegant: 'prose-stone',
};

function Settings({ isDark, settings, onSettingsChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg ${
          isDark
            ? 'bg-slate-700 hover:bg-slate-600'
            : 'bg-slate-200 hover:bg-slate-300'
        }`}
        title="Settings"
      >
        <Cog6ToothIcon className="w-5 h-5" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 p-4 rounded-lg shadow-xl z-50 ${
            isDark ? 'bg-slate-800' : 'bg-white border border-slate-200'
          }`}
        >
          {/* Font Size */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => onSettingsChange({ ...settings, fontSize: e.target.value })}
              className={`w-full p-2 rounded-lg ${
                isDark
                  ? 'bg-slate-700 border-slate-600'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Preview Style */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Preview Style</label>
            <select
              value={settings.previewStyle}
              onChange={(e) =>
                onSettingsChange({ ...settings, previewStyle: e.target.value })
              }
              className={`w-full p-2 rounded-lg ${
                isDark
                  ? 'bg-slate-700 border-slate-600'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="default">Default</option>
              <option value="github">GitHub</option>
              <option value="elegant">Elegant</option>
            </select>
          </div>

          {/* Line Numbers */}
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showLineNumbers}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    showLineNumbers: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm font-medium">Show Line Numbers</span>
            </label>
          </div>

          {/* Auto Save */}
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    autoSave: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm font-medium">Auto Save</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

Settings.propTypes = {
  isDark: PropTypes.bool.isRequired,
  settings: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
    previewStyle: PropTypes.string.isRequired,
    showLineNumbers: PropTypes.bool.isRequired,
    autoSave: PropTypes.bool.isRequired,
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired,
};

export { FONT_SIZES, PREVIEW_STYLES };
export default Settings;