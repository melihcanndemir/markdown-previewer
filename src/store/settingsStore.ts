import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EditorSettings } from '../types';

// Define the state structure and actions for the settings store
interface SettingsState {
  isDark: boolean;
  settings: EditorSettings;
  toggleTheme: () => void;
  setSettings: (newSettings: Partial<EditorSettings>) => void;
}

// Default settings to be used if nothing is in localStorage
const defaultSettings: EditorSettings = {
  fontSize: "medium",
  previewStyle: "default",
  showLineNumbers: true,
  editorHeight: "auto",
  showToolbar: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      isDark: true,
      settings: defaultSettings,

      // Actions
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'markdown-settings-storage', // Name for the localStorage item
      storage: createJSONStorage(() => localStorage), // Specify localStorage
      // We only want to persist the theme and editor settings, not the functions
      partialize: (state) => ({ isDark: state.isDark, settings: state.settings }),
    }
  )
); 