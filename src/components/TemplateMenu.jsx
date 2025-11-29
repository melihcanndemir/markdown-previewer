import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  DocumentDuplicateIcon,
  ChevronDownIcon,
  BookmarkIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { TEMPLATE_PRESETS } from './templates';

const TemplateMenu = ({ onLoadTemplate, isDark, currentMarkdown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState(() => {
    const saved = localStorage.getItem('custom-templates');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateToLoad, setTemplateToLoad] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Save custom templates to localStorage
  useEffect(() => {
    localStorage.setItem('custom-templates', JSON.stringify(customTemplates));
  }, [customTemplates]);

  const handleTemplateSelect = (template) => {
    if (currentMarkdown && currentMarkdown.trim() !== '') {
      setTemplateToLoad(template);
      return;
    }

    onLoadTemplate(template.content);
    setIsOpen(false);
  };

  const confirmLoadTemplate = () => {
    if (templateToLoad) {
      onLoadTemplate(templateToLoad.content);
      setTemplateToLoad(null);
      setIsOpen(false);
    }
  };

  const cancelLoadTemplate = () => {
    setTemplateToLoad(null);
  };

  const handleSaveCustomTemplate = () => {
    if (!newTemplateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (!currentMarkdown || currentMarkdown.trim() === '') {
      alert('Cannot save empty template');
      return;
    }

    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      icon: '⭐',
      category: 'Custom',
      content: currentMarkdown,
      createdAt: new Date().toISOString(),
    };

    setCustomTemplates([...customTemplates, newTemplate]);
    setNewTemplateName('');
    setShowSaveDialog(false);
    alert('Template saved successfully!');
  };

  const handleDeleteCustomTemplate = (templateId) => {
    const confirmed = window.confirm('Are you sure you want to delete this template?');
    if (!confirmed) return;

    setCustomTemplates(customTemplates.filter((t) => t.id !== templateId));
  };

  const allTemplates = [
    ...Object.values(TEMPLATE_PRESETS),
    ...customTemplates,
  ];

  // Group templates by category
  const templatesByCategory = allTemplates.reduce((acc, template) => {
    const category = template.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {});

  return (
    <>
      {/* Template Load Confirmation Modal */}
      {templateToLoad && (
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
                  Load Template
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <p className={`text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Loading <span className="font-semibold">&quot;{templateToLoad.name}&quot;</span> will replace your current content.
              </p>
              <p className={`text-sm mt-2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                This action cannot be undone. Are you sure you want to continue?
              </p>
            </div>

            {/* Actions */}
            <div className={`flex gap-3 px-6 py-4 border-t ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <button
                onClick={cancelLoadTemplate}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmLoadTemplate}
                className="flex-1 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              >
                Load Template
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500'
            : 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400'
        }`}
        title="Load template"
        aria-label="Load template"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <DocumentDuplicateIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline text-sm sm:text-base">Templates</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`fixed inset-0 sm:absolute sm:left-auto sm:right-0 sm:inset-auto sm:mt-2 w-full sm:w-80 h-full sm:h-auto sm:max-h-96 overflow-y-auto sm:rounded-lg shadow-lg z-50 ${
              isDark ? 'bg-slate-800 sm:border sm:border-slate-700' : 'bg-white sm:border sm:border-slate-200'
            }`}
          >
            {/* Mobile header with close button */}
            <div className={`sm:hidden sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h2 className="text-lg font-semibold">Templates</h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                }`}
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Save Current as Template */}
            <div className={`p-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            {!showSaveDialog ? (
              <button
                onClick={() => setShowSaveDialog(true)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-purple-700 hover:bg-purple-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Save Current as Template</span>
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Template name..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                      : 'bg-white border-slate-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveCustomTemplate()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCustomTemplate}
                    className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveDialog(false);
                      setNewTemplateName('');
                    }}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Templates by Category */}
          {Object.entries(templatesByCategory).map(([category, templates]) => (
            <div key={category} className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} last:border-b-0`}>
              <div className={`px-4 py-2 ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  {category}
                </h3>
              </div>
              <div className="py-1">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between group px-2"
                  >
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className={`flex-1 flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        isDark
                          ? 'hover:bg-slate-700 text-slate-200'
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span className="text-xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{template.name}</div>
                        {template.createdAt && (
                          <div className={`text-xs opacity-60`}>
                            Saved {new Date(template.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </button>
                    {category === 'Custom' && (
                      <button
                        onClick={() => handleDeleteCustomTemplate(template.id)}
                        className={`opacity-0 group-hover:opacity-100 p-2 rounded transition-all ${
                          isDark
                            ? 'hover:bg-red-900/30 text-red-400'
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                        title="Delete template"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className={`px-4 py-2 text-center ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {allTemplates.length} template{allTemplates.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        </>
      )}
    </div>
    </>
  );
};

TemplateMenu.propTypes = {
  onLoadTemplate: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  currentMarkdown: PropTypes.string,
};

export default TemplateMenu;
