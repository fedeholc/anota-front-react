import { useState } from "react";
import { useNotesDispatch } from "./NotesContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { dbAddNote } from "./dbHandler.jsx";
import { getFormattedDateTime } from "./utilityFunctions.jsx";
import ContentEditable from "react-contenteditable";

export default function NotesInput() {
  const dispatch = useNotesDispatch();

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
      noteText: newNoteObject.noteText,
      noteHTML: newNoteObject.noteHTML,
      noteTitle: newNoteObject.noteTitle,
      tags: "bla, otra",
      category: "caaat",
      deleted: false,
      archived: true,
      reminder: "default",
      rating: 0,
      created: getFormattedDateTime(),
      modified: getFormattedDateTime(),
    };
    console.log("guardar:", newNoteObject);
    dispatch({ type: "added", note: noteToAdd });
    dbAddNote(noteToAdd);
  }

  //TODO: ojo, al ir agregando campos acá también hay que ponerlos en la consulta sql del back
  function handleChange(event) {
     setNewNoteObject((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
   }

  function handleEditableChange(event) {
     setNewNoteObject((prev) => {
      return {
        ...prev,
        noteHTML: event.currentTarget.innerHTML,
        noteText: event.currentTarget.innerText,
      };
    });
  }

  return (
    <ul>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          margin: "1rem",
          maxWidth: "500px",
        }}
      >
        <div className="note_input_container">
          <input
            name="noteTitle"
            placeholder="Título..."
            value={newNoteObject.Title}
            onChange={handleChange}
            type="text"
            className="note_editable note_editable_title"
          />
          <ContentEditable
            html={`${newNoteObject.noteHTML}`}
            disabled={false}
            onChange={handleEditableChange}
            //data-key={note.id}
            //onBlur={handleGuardar}
            style={{
              height: "100px",
            }}
            className="note_editable"
          />
        </div>
        <button onClick={handleGuardar}>Guardar</button>
      </div>
    </ul>
  );
}
