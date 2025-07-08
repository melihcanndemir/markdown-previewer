// This file will serve as the single source of truth for shared types.

/**
 * Represents a single note object in the application.
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

/**
 * Represents the shared settings configuration for the editor and previewer.
 */
export interface EditorSettings {
  fontSize: keyof typeof FONT_SIZES; // Use keyof for type safety
  previewStyle: string;
  showLineNumbers: boolean;
  showToolbar: boolean;
  editorHeight: "auto" | string | number;
}

/**
 * Shared font size constants for editor and preview.
 * Using this with keyof EditorSettings['fontSize'] ensures consistency.
 */
export const FONT_SIZES = {
  small: "prose-sm",
  medium: "prose-base",
  large: "prose-lg",
}; 