//import { useState } from "react";
import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";

export default function NotesList() {
  const notes = useNotes();
  const dispatch = useNotesDispatch();

  function handleBorrar(event) {
    dispatch({ type: "deleted", deleteId: event.currentTarget.dataset.key });
  }

  function handleGuardarEditable(event) {
    dispatch({
      type: "updated",
      updateId: event.target.dataset.key,
      contenidoNuevoHTML: event.target.innerHTML,
      contenidoNuevoText: event.target.innerText,
    });
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
