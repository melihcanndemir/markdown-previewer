// Keyboard shortcuts configuration

export const KEYBOARD_SHORTCUTS = {
  general: {
    title: 'General',
    shortcuts: [
      {
        keys: ['Ctrl', 'S'],
        macKeys: ['⌘', 'S'],
        description: 'Save current document',
        action: 'Save to localStorage',
      },
      {
        keys: ['Ctrl', 'B'],
        macKeys: ['⌘', 'B'],
        description: 'Toggle editor fullscreen',
        action: 'Expand/collapse editor',
      },
      {
        keys: ['F11'],
        macKeys: ['F11'],
        description: 'Toggle browser fullscreen',
        action: 'Enter/exit fullscreen mode',
      },
      {
        keys: ['?'],
        macKeys: ['?'],
        description: 'Show keyboard shortcuts',
        action: 'Open this panel',
      },
    ],
  },

  editing: {
    title: 'Text Editing',
    shortcuts: [
      {
        keys: ['Ctrl', 'Z'],
        macKeys: ['⌘', 'Z'],
        description: 'Undo',
        action: 'Undo last change',
      },
      {
        keys: ['Ctrl', 'Y'],
        macKeys: ['⌘', 'Shift', 'Z'],
        description: 'Redo',
        action: 'Redo last undone change',
      },
      {
        keys: ['Ctrl', 'A'],
        macKeys: ['⌘', 'A'],
        description: 'Select all',
        action: 'Select all text',
      },
      {
        keys: ['Ctrl', 'C'],
        macKeys: ['⌘', 'C'],
        description: 'Copy',
        action: 'Copy selected text',
      },
      {
        keys: ['Ctrl', 'X'],
        macKeys: ['⌘', 'X'],
        description: 'Cut',
        action: 'Cut selected text',
      },
      {
        keys: ['Ctrl', 'V'],
        macKeys: ['⌘', 'V'],
        description: 'Paste',
        action: 'Paste from clipboard',
      },
      {
        keys: ['Tab'],
        macKeys: ['Tab'],
        description: 'Indent',
        action: 'Add indentation',
      },
      {
        keys: ['Shift', 'Tab'],
        macKeys: ['Shift', 'Tab'],
        description: 'Outdent',
        action: 'Remove indentation',
      },
    ],
  },

  markdown: {
    title: 'Markdown Formatting',
    shortcuts: [
      {
        keys: ['Ctrl', 'B'],
        macKeys: ['⌘', 'B'],
        description: 'Bold',
        action: 'Wrap text with **bold**',
        example: '**text**',
      },
      {
        keys: ['Ctrl', 'I'],
        macKeys: ['⌘', 'I'],
        description: 'Italic',
        action: 'Wrap text with *italic*',
        example: '*text*',
      },
      {
        keys: ['Ctrl', 'K'],
        macKeys: ['⌘', 'K'],
        description: 'Insert link',
        action: 'Create [link](url)',
        example: '[text](url)',
      },
    ],
  },

  navigation: {
    title: 'Navigation',
    shortcuts: [
      {
        keys: ['Ctrl', '↑'],
        macKeys: ['⌘', '↑'],
        description: 'Go to start',
        action: 'Move cursor to document start',
      },
      {
        keys: ['Ctrl', '↓'],
        macKeys: ['⌘', '↓'],
        description: 'Go to end',
        action: 'Move cursor to document end',
      },
      {
        keys: ['Home'],
        macKeys: ['Home'],
        description: 'Go to line start',
        action: 'Move cursor to line start',
      },
      {
        keys: ['End'],
        macKeys: ['End'],
        description: 'Go to line end',
        action: 'Move cursor to line end',
      },
      {
        keys: ['Page Up'],
        macKeys: ['Page Up'],
        description: 'Scroll up',
        action: 'Scroll one page up',
      },
      {
        keys: ['Page Down'],
        macKeys: ['Page Down'],
        description: 'Scroll down',
        action: 'Scroll one page down',
      },
    ],
  },

  features: {
    title: 'Features',
    shortcuts: [
      {
        keys: ['Click'],
        macKeys: ['Click'],
        description: 'Import file',
        action: 'Import .md file from toolbar',
      },
      {
        keys: ['Click'],
        macKeys: ['Click'],
        description: 'Export menu',
        action: 'Export as MD/HTML/PDF',
      },
      {
        keys: ['Click'],
        macKeys: ['Click'],
        description: 'Templates',
        action: 'Load or save templates',
      },
      {
        keys: ['Click'],
        macKeys: ['Click'],
        description: 'AI Assistant',
        action: 'Open Gemini AI helper',
      },
      {
        keys: ['Drag & Drop'],
        macKeys: ['Drag & Drop'],
        description: 'Import file',
        action: 'Drop .md file anywhere',
      },
    ],
  },

  accessibility: {
    title: 'Accessibility',
    shortcuts: [
      {
        keys: ['Tab'],
        macKeys: ['Tab'],
        description: 'Focus next element',
        action: 'Navigate through interactive elements',
      },
      {
        keys: ['Shift', 'Tab'],
        macKeys: ['Shift', 'Tab'],
        description: 'Focus previous element',
        action: 'Navigate backwards',
      },
      {
        keys: ['Enter'],
        macKeys: ['Enter'],
        description: 'Activate button',
        action: 'Click focused button',
      },
      {
        keys: ['Esc'],
        macKeys: ['Esc'],
        description: 'Close dialog',
        action: 'Close modal/dropdown',
      },
      {
        keys: ['Space'],
        macKeys: ['Space'],
        description: 'Activate button',
        action: 'Alternative to Enter',
      },
    ],
  },
};

// Detect platform
export const isMac = () => {
  return typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
};

// Get appropriate keys for current platform
export const getKeys = (shortcut) => {
  return isMac() ? shortcut.macKeys : shortcut.keys;
};

// Format key for display
export const formatKey = (key) => {
  const keyMap = {
    'Ctrl': 'Ctrl',
    'Shift': 'Shift',
    'Alt': 'Alt',
    'Enter': '↵',
    '↑': '↑',
    '↓': '↓',
    '←': '←',
    '→': '→',
    'Space': 'Space',
    'Esc': 'Esc',
  };

  return keyMap[key] || key;
};
