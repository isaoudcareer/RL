import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useNotesStore } from '../../stores/notesStore';
import { useAppStore } from '../../stores/appStore';
import { NoteEditor } from './NoteEditor';
import { format } from 'date-fns';

export function NotesView() {
  const { notes, addNote, deleteNote } = useNotesStore();
  const { selectedNoteId, setSelectedNoteId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = () => {
    addNote({
      title: 'Untitled Note',
      content: '',
    });
    const newNote = notes[notes.length];
    if (newNote) {
      setSelectedNoteId(newNote.id);
    }
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Notes List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <button
              onClick={handleCreateNote}
              className="p-2 rounded-lg bg-kiwii-500 text-white hover:bg-kiwii-600 transition-colors"
              title="New Note"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiwii-500"
          />
        </div>

        <div className="flex-1 overflow-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? 'No notes found' : 'No notes yet. Create one!'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedNoteId === note.id ? 'bg-kiwii-50' : ''
                  }`}
                  onClick={() => setSelectedNoteId(note.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {note.title || 'Untitled'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {note.content.replace(/<[^>]*>/g, '') || 'No content'}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 bg-gray-50">
        {selectedNote ? (
          <NoteEditor note={selectedNote} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}
