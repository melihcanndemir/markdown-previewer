import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note } from '../types';

// Define the state structure and actions for the notes store
interface NotesState {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

// Default welcome note
const defaultNote: Note = {
  id: "welcome",
  title: "Welcome!",
  content: "# Welcome!\n\nYou can write markdown here...",
  createdAt: new Date().toISOString(),
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      // Initial state
      notes: [defaultNote],

      // Actions
      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),

      getNoteById: (id) => {
        const state = get();
        return state.notes.find((note) => note.id === id);
      },
    }),
    {
      name: 'markdown-notes-storage', // Name for the localStorage item
      storage: createJSONStorage(() => localStorage), // Specify localStorage
      // We only want to persist the notes array, not the functions
      partialize: (state) => ({ notes: state.notes }),
    }
  )
); 