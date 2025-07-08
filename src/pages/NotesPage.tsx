import React from "react";
import { Link } from "react-router-dom";
import { PlusIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { Note } from "../types"; // Corrected path
import { useNotesStore } from "../store/notesStore";
import { useSettingsStore } from "../store/settingsStore";

// Type Definitions - No props needed anymore
interface NotesPageProps {}

const NotesPage: React.FC<NotesPageProps> = () => {
  // Get state and actions from Zustand stores
  const { notes, addNote, deleteNote, updateNote } = useNotesStore();
  const { isDark } = useSettingsStore();

  // Add new note
  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "# New Note\n\nWrite here...",
      createdAt: new Date().toISOString(),
    };
    addNote(newNote);
  };

  // Delete note
  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
  };

  // Update note title
  const handleUpdateNoteTitle = (noteId: string, newTitle: string) => {
    updateNote(noteId, { title: newTitle });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          My Notes
        </h1>
        <button
          onClick={handleAddNote}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-500 hover:bg-purple-600"
          } text-white`}
          aria-label="Add new note"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Empty State */}
      {notes.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className={`text-center py-12 px-6 max-w-lg w-full mx-auto ${
            isDark ? "bg-slate-800/50" : "bg-white"
          } rounded-xl shadow-lg backdrop-blur-sm border ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}>
            <DocumentTextIcon className={`w-16 h-16 mx-auto mb-6 ${
              isDark ? "text-slate-600" : "text-slate-400"
            }`} />
            <h2 className={`text-2xl font-bold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              No Notes Yet
            </h2>
            <p className={`text-base mb-6 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Click the &apos;+&apos; button to create a new note
            </p>
            <button
              onClick={handleAddNote}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                isDark
                  ? "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20"
                  : "bg-purple-500 hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/20"
              } text-white`}
            >
              Create New Note
            </button>
          </div>
        </div>
      ) : (
        /* Notes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note: Note) => (
            <div key={note.id} className="group relative">
              <Link
                to={`/edit/${note.id}`}
                className={`block p-6 rounded-lg ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-white hover:bg-gray-50"
                } shadow-lg transition-all duration-200 hover:shadow-xl`}
              >
                <div className="flex justify-between items-start mb-4">
                  <input
                    type="text"
                    value={note.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUpdateNoteTitle(note.id, e.target.value);
                    }}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`text-xl font-semibold bg-transparent outline-none ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  />
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                      isDark 
                        ? "hover:bg-red-500/20 text-red-400 hover:text-red-500" 
                        : "hover:bg-red-100 text-red-500 hover:text-red-600"
                    }`}
                    aria-label="Delete note"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className={`mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  {note.content.split('\n')[0].replace('#', '').trim()}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`px-4 py-2 rounded ${
                    isDark
                      ? "bg-purple-600/10 text-purple-400"
                      : "bg-purple-500/10 text-purple-600"
                  }`}>
                    Edit
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesPage; 