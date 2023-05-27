import { useNotes } from "./NotesContext.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Note } from "./components/note/Note";
import "./NoteInput.css";
export default function NotesInput() {
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNote, setNewNote] = useState({
    id: uuidv4(),
    noteText: "",
    noteHTML: "",
    noteTitle: "",
    tags: "",
    category: "",
    deleted: false,
    archived: false,
    reminder: "",
    rating: 0,
    created: "",
    modified: "",
  });

  const notes = useNotes();

  useEffect(() => {
    setNewNote({
      id: uuidv4(),
      noteText: "",
      noteHTML: "",
      noteTitle: "",
      tags: "",
      category: "",
      deleted: false,
      archived: false,
      reminder: "",
      rating: 0,
      created: "",
      modified: "",
    });
  }, [notes]);

  return (
    <>
      {!showNewNote && (
        <div>
          <div className="new-note__container">
            <input
              name="noteTitle"
              placeholder="Nueva nota..."
              type="text"
              className="new-note__title"
              onFocus={() => {
                setShowNewNote(true);
              }}
            />
          </div>
        </div>
      )}
      {showNewNote && (
        <Note
          note={newNote}
          isNewNote={true}
          setShowNewNote={setShowNewNote}
          noteOverflow={null}
        ></Note>
      )}
    </>
  );
}
