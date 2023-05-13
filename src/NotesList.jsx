//import { useState } from "react";
import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbUpdateNote, dbDeleteNote } from "./dbHandler.jsx";

export default function NotesList() {
  const notes = useNotes();
  const dispatch = useNotesDispatch();

  function handleBorrar(event) {
    dispatch({ type: "deleted", deleteId: event.currentTarget.dataset.key });
    dbDeleteNote(event.currentTarget.dataset.key);
  }

  function handleGuardarEditable(event) {
    //TODO: completar otros campos
    const noteToUpdate = {
      id: event.target.dataset.key,
      noteText: event.target.innerText,
      noteHTML: event.target.innerHTML,
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

    dispatch({ type: "updated", note: noteToUpdate });
    dbUpdateNote(noteToUpdate);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "0.4rem",
        justifyContent: "center",
        margin: "1rem",
      }}
    >
      {notes &&
        notes.map((note, index) => {
          return (
            <div
              key={note.id}
              style={{
                border: "1px solid gray",
                borderRadius: "5px",
                padding: "0.4rem",
              }}
            >
              <div>{note.id}</div>
              <div>Nota: </div>
              <ContentEditable
                html={`${notes[index].noteHTML}`} // innerHTML of the editable div
                disabled={false} // use true to disable edition
                //onChange={handleEditableChange} // handle innerHTML change
                data-key={note.id}
                onBlur={handleGuardarEditable}
              />
              <button data-key={note.id} onClick={handleBorrar}>
                borrar
              </button>
            </div>
          );
        })}
    </div>
  );
}
