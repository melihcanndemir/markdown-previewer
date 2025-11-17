import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const TabBar = ({ tabs, activeTabId, onTabChange, onTabClose, onTabAdd, onTabRename, isDark }) => {
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingName, setEditingName] = useState('');

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

  return (
    <div className={`flex items-center gap-1 overflow-x-auto ${
      isDark ? 'bg-slate-900 scrollbar-modern-dark' : 'bg-slate-200 scrollbar-modern'
    } px-2 py-1 rounded-t-lg`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isEditing = editingTabId === tab.id;

        return (
          <div
            key={tab.id}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer min-w-[120px] max-w-[200px] group ${
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
              <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  className={`flex-1 px-1 py-0.5 text-xs rounded border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(tab.id)}
                  className="p-0.5 hover:bg-green-500/20 rounded"
                  title="Save"
                >
                  <CheckIcon className="w-3 h-3 text-green-500" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-0.5 hover:bg-red-500/20 rounded"
                  title="Cancel"
                >
                  <XMarkIcon className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-xs truncate flex-1">{tab.name}</span>
                <button
                  onClick={(e) => handleStartEdit(tab, e)}
                  className={`p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'
                  }`}
                  title="Rename tab"
                >
                  <PencilIcon className="w-3 h-3" />
                </button>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabClose(tab.id);
                    }}
                    className={`p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-500/20'
                    }`}
                    title="Close tab"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* Add Tab Button */}
      <button
        onClick={onTabAdd}
        className={`p-1.5 rounded-lg transition-colors ${
          isDark
            ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
            : 'hover:bg-slate-300 text-slate-600 hover:text-slate-900'
        }`}
        title="New tab (Alt+T)"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
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
