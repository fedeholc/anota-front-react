import { useState } from "react";
import { useNotesDispatch } from "./NotesContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { dbAddNote } from "./dbHandler.jsx";
export default function NotesInput() {
  const dispatch = useNotesDispatch();

  const [newNote, setNewNote] = useState("");

  function handleGuardar() {
    const noteToAdd = {
      id: uuidv4(),
      noteText: newNote,
      noteHTML: newNote,
      noteTitle: "tttttit?",
      tags: "bla, otra",
      category: "caaat",
      deleted: false,
      archived: false,
      reminder: "default",
      rating: 0,
      created: "1000-01-01 00:00:00",
      modified: "1000-01-01 00:00:00",
    };

    dispatch({ type: "added", note: noteToAdd });
    dbAddNote(noteToAdd);
  }

  return (
    <ul>
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          justifyContent: "center",
          margin: "1rem",
        }}
      >
        <input
          name="newNote"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          type="text"
        />
        <button onClick={handleGuardar}>Guardar</button>
      </div>
    </ul>
  );
}
