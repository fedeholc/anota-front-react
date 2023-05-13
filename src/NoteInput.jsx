import { useState } from "react";
import { useNotesDispatch } from "./NotesContext.jsx";

export default function NotesInput() {
  const dispatch = useNotesDispatch();

  const [newNote, setNewNote] = useState("");

  function handleGuardar() {
    dispatch({ type: "added", noteText: newNote, noteHTML: newNote });
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
