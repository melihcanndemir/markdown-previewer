import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { KEYBOARD_SHORTCUTS, isMac, getKeys, formatKey } from './keyboardShortcuts';

const KeyboardShortcutsPanel = ({ isOpen, onClose, isDark }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  const platform = isMac() ? 'macOS' : 'Windows/Linux';

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-center sm:p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full sm:max-w-5xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden sm:rounded-2xl shadow-2xl ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } flex flex-col animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <CommandLineIcon className="w-8 h-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Detected: {platform}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            aria-label="Close shortcuts panel"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(KEYBOARD_SHORTCUTS).map(([categoryKey, category]) => (
              <div key={categoryKey} className="space-y-3">
                <h3
                  className={`text-lg font-bold flex items-center gap-2 pb-2 border-b ${
                    isDark ? 'border-gray-700 text-purple-400' : 'border-gray-200 text-purple-600'
                  }`}
                >
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut, index) => {
                    const keys = getKeys(shortcut);
                    return (
                      <div
                        key={index}
                        className={`flex items-start justify-between gap-4 p-3 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{shortcut.description}</div>
                          {shortcut.action && (
                            <div
                              className={`text-xs mt-1 ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              {shortcut.action}
                            </div>
                          )}
                          {shortcut.example && (
                            <code
                              className={`text-xs mt-1 px-2 py-0.5 rounded ${
                                isDark ? 'bg-gray-900 text-purple-400' : 'bg-gray-100 text-purple-600'
                              }`}
                            >
                              {shortcut.example}
                            </code>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="flex items-center gap-1">
                              <kbd
                                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md shadow-sm ${
                                  isDark
                                    ? 'bg-gray-700 text-gray-200 border border-gray-600'
                                    : 'bg-white text-gray-700 border border-gray-300'
                                }`}
                              >
                                {formatKey(key)}
                              </kbd>
                              {keyIndex < keys.length - 1 && (
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  +
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${
            isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>Press</span>
              <kbd
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  isDark
                    ? 'bg-gray-700 text-gray-200 border border-gray-600'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                ?
              </kbd>
              <span>anytime to open this panel</span>
            </div>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-purple-700 hover:bg-purple-600 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

KeyboardShortcutsPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default KeyboardShortcutsPanel;
