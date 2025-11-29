import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const TabBar = ({ tabs, activeTabId, onTabChange, onTabClose, onTabAdd, onTabRename, isDark }) => {
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [tabToClose, setTabToClose] = useState(null);

  const handleStartEdit = (tab, e) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditingName(tab.name);
  };

  const handleSaveEdit = (tabId) => {
    if (editingName.trim()) {
      onTabRename(tabId, editingName.trim());
    }
    setEditingTabId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingTabId(null);
    setEditingName('');
  };

  const handleKeyDown = (e, tabId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(tabId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleCloseTab = (e, tab) => {
    e.stopPropagation();
    setTabToClose(tab);
  };

  const confirmCloseTab = () => {
    if (tabToClose) {
      onTabClose(tabToClose.id);
      setTabToClose(null);
    }
  };

  const cancelCloseTab = () => {
    setTabToClose(null);
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {tabToClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-xl shadow-2xl ${
              isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-6 pb-4">
              <div className={`p-3 rounded-full ${
                isDark ? 'bg-amber-500/20' : 'bg-amber-100'
              }`}>
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Close Tab
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <p className={`text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Are you sure you want to close <span className="font-semibold">&quot;{tabToClose.name}&quot;</span>?
              </p>
              <p className={`text-sm mt-2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                This action cannot be undone and the tab content will be permanently deleted.
              </p>
            </div>

            {/* Actions */}
            <div className={`flex gap-3 px-6 py-4 border-t ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <button
                onClick={cancelCloseTab}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmCloseTab}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Close Tab
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`flex items-center gap-1 sm:gap-2 overflow-x-auto ${
        isDark ? 'bg-slate-900 scrollbar-modern-dark' : 'bg-slate-200 scrollbar-modern'
      } px-2 py-1 rounded-t-lg`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isEditing = editingTabId === tab.id;

        return (
          <div
            key={tab.id}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer min-w-[100px] sm:min-w-[120px] max-w-[150px] sm:max-w-[200px] group ${
              isActive
                ? isDark
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-900'
                : isDark
                  ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800/70'
                  : 'bg-slate-300/50 text-slate-600 hover:bg-slate-300'
            }`}
            onClick={() => !isEditing && onTabChange(tab.id)}
          >
            {isEditing ? (
              <div className="flex items-center gap-0.5 sm:gap-1 flex-1 w-full" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  className={`flex-1 min-w-0 px-1 py-0.5 text-xs rounded border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                  autoFocus
                />
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => handleSaveEdit(tab.id)}
                    className="p-0.5 sm:p-1 hover:bg-green-500/20 rounded transition-colors"
                    title="Save"
                    aria-label="Save tab name"
                  >
                    <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-0.5 sm:p-1 hover:bg-red-500/20 rounded transition-colors"
                    title="Cancel"
                    aria-label="Cancel editing"
                  >
                    <XMarkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="text-xs truncate flex-1 min-w-0">{tab.name}</span>
                <div className="flex items-center gap-0.5 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleStartEdit(tab, e)}
                    className={`p-0.5 sm:p-1 rounded transition-colors ${
                      isDark ? 'hover:bg-slate-700 active:bg-slate-600' : 'hover:bg-slate-200 active:bg-slate-300'
                    }`}
                    title="Rename tab"
                    aria-label="Rename tab"
                  >
                    <PencilIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => handleCloseTab(e, tab)}
                      className={`p-0.5 sm:p-1 rounded transition-colors ${
                        isDark ? 'hover:bg-red-500/20 active:bg-red-500/30' : 'hover:bg-red-500/20 active:bg-red-500/30'
                      }`}
                      title="Close tab"
                      aria-label="Close tab"
                    >
                      <XMarkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Add Tab Button */}
      <button
        onClick={onTabAdd}
        className={`p-1 sm:p-1.5 rounded-lg transition-colors flex-shrink-0 ${
          isDark
            ? 'hover:bg-slate-700 active:bg-slate-600 text-slate-400 hover:text-white'
            : 'hover:bg-slate-300 active:bg-slate-400 text-slate-600 hover:text-slate-900'
        }`}
        title="New tab (Alt+T)"
        aria-label="Create new tab"
      >
        <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
    </>
  );
};

TabBar.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTabId: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onTabClose: PropTypes.func.isRequired,
  onTabAdd: PropTypes.func.isRequired,
  onTabRename: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default TabBar;
