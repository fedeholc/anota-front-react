import { useState } from "react";
import { useNotesDispatch } from "./NotesContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { dbAddNote } from "./dbHandler.jsx";
import { getFormattedDateTime } from "./utilityFunctions.jsx";
import ContentEditable from "react-contenteditable";

export default function NotesInput() {
  const dispatch = useNotesDispatch();

  const [newNote, setNewNote] = useState("");

  const [newNoteObject, setNewNoteObject] = useState({
    id: "",
    noteText: "fede",
    noteHTML: "fede",
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

  function handleGuardar(event) {
    const noteToAdd = {
      id: uuidv4(),
      noteText: event.target.innerText,
      noteHTML: event.target.innerHTML,
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
    console.log(event.target.value);
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
          flexDirection: "column",
          gap: "0.4rem",
          margin: "1rem",
          maxWidth: "500px",
        }}
      >
        <div>
          <input
            name="noteTitle"
            value={newNoteObject.Title}
            onChange={handleChange}
            type="text"
          />
          <ContentEditable
            html={`${newNoteObject.noteHTML}`} // innerHTML of the editable div
            disabled={false} // use true to disable edition
            //onChange={handleEditableChange} // handle innerHTML change
            //data-key={note.id}
            onBlur={handleGuardar}
            style={{
              border: "1px solid gray",
              height: "100px",
              borderRadius: "5px",
              padding: "0.5rem",
              overflowY: "scroll",
            }}
          />
        </div>
        <button>Guardar</button>
      </div>
    </ul>
  );
}
