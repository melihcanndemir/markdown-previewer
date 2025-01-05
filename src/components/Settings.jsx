import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export const FONT_SIZES = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

export const PREVIEW_STYLES = {
  default: "prose-slate",
  github: "prose-neutral",
  elegant: "prose-stone",
};

function Settings({ isDark, settings, onSettingsChange, isMobile, orientation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const settingsRef = useRef(null);
  const buttonRef = useRef(null);

  const calculateMenuPosition = useCallback(() => {
    if (!buttonRef.current || !settingsRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuRect = settingsRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate available space in different directions
    const spaceAbove = buttonRect.top;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceLeft = buttonRect.left;
    const spaceRight = viewportWidth - buttonRect.right;

    let top, left, transformOrigin;

    // Determine vertical position
    if (spaceBelow >= menuRect.height || spaceBelow >= spaceAbove) {
      top = buttonRect.bottom + 8;
      transformOrigin = 'top';
    } else {
      top = buttonRect.top - menuRect.height - 8;
      transformOrigin = 'bottom';
    }

    // Determine horizontal position
    if (isMobile) {
      // Center the menu on mobile
      left = Math.max(16, Math.min(
        viewportWidth - menuRect.width - 16,
        buttonRect.left + (buttonRect.width - menuRect.width) / 2
      ));
    } else if (spaceRight >= menuRect.width || spaceRight >= spaceLeft) {
      left = buttonRect.right - menuRect.width;
    } else {
      left = buttonRect.left;
    }

    // Adjust for screen edges
    top = Math.max(16, Math.min(viewportHeight - menuRect.height - 16, top));
    left = Math.max(16, Math.min(viewportWidth - menuRect.width - 16, left));

    setMenuPosition({ top, left, transformOrigin });
  }, [isMobile]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Handle menu positioning
  useEffect(() => {
    if (isOpen) {
      calculateMenuPosition();
      // Recalculate position after a short delay to account for animations
      const timer = setTimeout(calculateMenuPosition, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, calculateMenuPosition, orientation]);

  // Handle window resize
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('resize', calculateMenuPosition);
      return () => window.removeEventListener('resize', calculateMenuPosition);
    }
  }, [isOpen, calculateMenuPosition]);

  const toggleSettings = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Custom styles for the settings panel
  const menuStyles = {
    position: 'fixed',
    top: `${menuPosition.top}px`,
    left: `${menuPosition.left}px`,
    transformOrigin: menuPosition.transformOrigin,
    zIndex: 50,
    minWidth: isMobile ? 'calc(100vw - 32px)' : '280px',
    maxWidth: isMobile ? 'calc(100vw - 32px)' : '320px',
    maxHeight: 'calc(100vh - 32px)',
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleSettings}
        className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
          isDark
            ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-500"
            : "bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
        } ${isOpen ? 'ring-2 ring-purple-500' : ''}`}
        title="Settings"
        aria-label="Open settings menu"
        aria-expanded={isOpen}
      >
        <Cog6ToothIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay on mobile */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
          )}

          <div
            ref={settingsRef}
            style={menuStyles}
            className={`rounded-lg shadow-xl overflow-y-auto overscroll-contain ${
              isDark ? "bg-slate-800" : "bg-white border border-slate-200"
            } p-4 animate-in fade-in zoom-in-95 duration-200`}
          >
            {/* Font Size Setting */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) =>
                  onSettingsChange({ ...settings, fontSize: e.target.value })
                }
                className={`w-full p-2 text-sm rounded-lg transition-colors ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Preview Style Setting */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Preview Style
              </label>
              <select
                value={settings.previewStyle}
                onChange={(e) =>
                  onSettingsChange({ ...settings, previewStyle: e.target.value })
                }
                className={`w-full p-2 text-sm rounded-lg transition-colors ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <option value="default">Default</option>
                <option value="github">GitHub</option>
                <option value="elegant">Elegant</option>
              </select>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showLineNumbers}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      showLineNumbers: e.target.checked,
                    })
                  }
                  className={`rounded transition-colors ${
                    isDark
                      ? "bg-slate-700 border-slate-600"
                      : "bg-slate-50 border-slate-200"
                  }`}
                />
                <span className="text-sm font-medium">Show Line Numbers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      autoSave: e.target.checked,
                    })
                  }
                  className={`rounded transition-colors ${
                    isDark
                      ? "bg-slate-700 border-slate-600"
                      : "bg-slate-50 border-slate-200"
                  }`}
                />
                <span className="text-sm font-medium">Auto Save</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.syncScroll}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      syncScroll: e.target.checked,
                    })
                  }
                  className={`rounded transition-colors ${
                    isDark
                      ? "bg-slate-700 border-slate-600"
                      : "bg-slate-50 border-slate-200"
                  }`}
                />
                <span className="text-sm font-medium">Sync Scrolling</span>
              </label>
            </div>
          </div>
        </>
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
    syncScroll: PropTypes.bool,
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  orientation: PropTypes.string,
};

export default Settings;