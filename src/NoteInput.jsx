import { useState } from "react";
import { useNotesDispatch } from "./NotesContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { dbAddNote } from "./dbHandler.jsx";
export default function NotesInput() {
  const dispatch = useNotesDispatch();

  const [newNote, setNewNote] = useState("");

  const [newNoteObject, setNewNoteObject] = useState({
    id: "",
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

  function handleGuardar() {
    const noteToAdd = {
      id: uuidv4(),
      noteText: newNote,
      noteHTML: newNote,
      noteTitle: newNoteObject.noteTitle,
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

  //TODO: ojo, al ir agregando campos acá también hay que ponerlos en la consulta sql del back
  function handleChange(event) {
    setNewNoteObject((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
    console.log(newNoteObject);
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
          name="noteTitle"
          value={newNoteObject.Title}
          onChange={handleChange}
          type="text"
        />
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
