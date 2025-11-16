import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  XMarkIcon,
  PaintBrushIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { PREVIEW_STYLES } from './constants';

const ThemeCustomizer = ({ isOpen, onClose, isDark, onThemeChange }) => {
  const [customThemes, setCustomThemes] = useState(() => {
    const saved = localStorage.getItem('custom-themes');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTheme, setCurrentTheme] = useState({
    name: 'My Custom Theme',
    prose: 'prose-slate',
    headingColor: isDark ? '#e2e8f0' : '#1e293b',
    linkColor: isDark ? '#60a5fa' : '#2563eb',
    codeBackground: isDark ? '#1e293b' : '#f1f5f9',
    borderColor: isDark ? '#334155' : '#cbd5e1',
  });

  const [themeName, setThemeName] = useState('My Custom Theme');

  // Save custom themes to localStorage
  useEffect(() => {
    localStorage.setItem('custom-themes', JSON.stringify(customThemes));
  }, [customThemes]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleColorChange = (field, value) => {
    setCurrentTheme(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveTheme = () => {
    if (!themeName.trim()) {
      alert('Please enter a theme name');
      return;
    }

    const newTheme = {
      ...currentTheme,
      name: themeName,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setCustomThemes([...customThemes, newTheme]);
    alert(`Theme "${themeName}" saved successfully!`);
  };

  const handleLoadTheme = (theme) => {
    setCurrentTheme(theme);
    setThemeName(theme.name);
  };

  const handleDeleteTheme = (themeId) => {
    if (window.confirm('Delete this theme?')) {
      setCustomThemes(customThemes.filter(t => t.id !== themeId));
    }
  };

  const handleApplyTheme = () => {
    onThemeChange(currentTheme);
    onClose();
  };

  const handleResetToDefaults = () => {
    const defaultTheme = PREVIEW_STYLES.default;
    setCurrentTheme({
      name: 'Default',
      prose: defaultTheme.prose,
      headingColor: isDark ? '#e2e8f0' : '#1e293b',
      linkColor: isDark ? '#60a5fa' : '#2563eb',
      codeBackground: isDark ? '#1e293b' : '#f1f5f9',
      borderColor: isDark ? '#334155' : '#cbd5e1',
    });
  };

  const handleExportTheme = () => {
    const dataStr = JSON.stringify(currentTheme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${themeName.replace(/\s+/g, '-').toLowerCase()}-theme.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setCurrentTheme(imported);
        setThemeName(imported.name || 'Imported Theme');
        alert('Theme imported successfully!');
      } catch (error) {
        alert('Invalid theme file');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } flex flex-col`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <PaintBrushIcon className="w-8 h-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold">Theme Customizer</h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Create your own preview theme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            aria-label="Close theme customizer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Theme Editor */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Customize Colors</h3>

              {/* Theme Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Theme Name</label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>

              {/* Color Pickers */}
              <div className="space-y-3">
                <ColorPicker
                  label="Heading Color"
                  value={currentTheme.headingColor}
                  onChange={(val) => handleColorChange('headingColor', val)}
                  isDark={isDark}
                />
                <ColorPicker
                  label="Link Color"
                  value={currentTheme.linkColor}
                  onChange={(val) => handleColorChange('linkColor', val)}
                  isDark={isDark}
                />
                <ColorPicker
                  label="Code Background"
                  value={currentTheme.codeBackground}
                  onChange={(val) => handleColorChange('codeBackground', val)}
                  isDark={isDark}
                />
                <ColorPicker
                  label="Border Color"
                  value={currentTheme.borderColor}
                  onChange={(val) => handleColorChange('borderColor', val)}
                  isDark={isDark}
                />
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={handleSaveTheme}
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  Save Theme
                </button>
                <button
                  onClick={handleResetToDefaults}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  Reset to Defaults
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportTheme}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isDark
                        ? 'bg-blue-700 hover:bg-blue-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Export
                  </button>
                  <label
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      isDark
                        ? 'bg-blue-700 hover:bg-blue-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    <ArrowUpTrayIcon className="w-4 h-4" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportTheme}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Saved Themes & Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Saved Themes</h3>

              {customThemes.length === 0 ? (
                <div className={`p-4 rounded-lg text-center ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                  <p className="text-sm opacity-70">No saved themes yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {customThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{theme.name}</div>
                        <div className="flex gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: theme.headingColor }}
                            title="Heading"
                          />
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: theme.linkColor }}
                            title="Link"
                          />
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: theme.codeBackground }}
                            title="Code"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoadTheme(theme)}
                          className="px-3 py-1 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteTheme(theme.id)}
                          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Live Preview */}
              <div>
                <h3 className="text-lg font-bold mb-2">Live Preview</h3>
                <div
                  className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <h1 style={{ color: currentTheme.headingColor }} className="text-2xl font-bold mb-2">
                    Heading Example
                  </h1>
                  <p className="mb-2">
                    This is a paragraph with a{' '}
                    <a href="#" style={{ color: currentTheme.linkColor }} className="underline">
                      link example
                    </a>
                    .
                  </p>
                  <code
                    style={{ backgroundColor: currentTheme.codeBackground }}
                    className="px-2 py-1 rounded"
                  >
                    code example
                  </code>
                  <hr style={{ borderColor: currentTheme.borderColor }} className="my-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          } flex justify-end gap-3`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleApplyTheme}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};

// Color Picker Component
const ColorPicker = ({ label, value, onChange, isDark }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 px-3 py-2 rounded-lg border ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

ThemeCustomizer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  onThemeChange: PropTypes.func.isRequired,
};

export default ThemeCustomizer;
