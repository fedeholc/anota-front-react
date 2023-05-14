//import { useState } from "react";
import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbUpdateNote, dbDeleteNote } from "./dbHandler.jsx";
import { getFormattedDateTime, dateTimeJStoDB } from "./utilityFunctions.jsx";

export default function NotesList() {
  const notes = useNotes();
  const dispatch = useNotesDispatch();

  function handleDelete(event) {
    dispatch({ type: "deleted", deleteId: event.currentTarget.dataset.key });
    dbDeleteNote(event.currentTarget.dataset.key);
  }

  function handleUpdate(event) {
    //TODO: completar otros campos
    let noteIndex = notes.findIndex(
      (obj) => obj.id === event.target.dataset.key
    );
    const updatedNote = {
      id: event.target.dataset.key,
      noteText: event.target.innerText,
      noteHTML: event.target.innerHTML,
      noteTitle: notes[noteIndex].noteTitle,
      tags: notes[noteIndex].tags,
      category: notes[noteIndex].category,
      deleted: notes[noteIndex].deleted,
      archived: notes[noteIndex].archived,
      reminder: notes[noteIndex].reminder,
      rating: notes[noteIndex].rating,
      //FIXME: ojo, esto está porque cuando viene la fecha en formato JSON lo hace así 2023-05-14T14:32:50.000Z en lugar de como la pide para ser guardada. Ver si mejor cambiarla cuando se cargan los datos para que ya quede.
      created: dateTimeJStoDB(notes[noteIndex].created),
      modified: getFormattedDateTime(),
    };

    dispatch({ type: "updated", note: updatedNote });
    dbUpdateNote(updatedNote);
  }

  notes &&
    console.log(
      notes[0].created.slice(0, 10) + " " + notes[0].created.slice(11, 19)
    );
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
            <div key={note.id}>
              <div
                style={{
                  border: "1px solid gray",
                  borderRadius: "5px",
                  padding: "0.4rem",
                }}
              >
                <div>
                  <strong>{note.noteTitle}</strong>
                </div>
                <ContentEditable
                  html={`${notes[index].noteHTML}`} // innerHTML of the editable div
                  disabled={false} // use true to disable edition
                  //onChange={handleEditableChange} // handle innerHTML change
                  data-key={note.id}
                  onBlur={handleUpdate}
                />
                <button data-key={note.id} onClick={handleDelete}>
                  borrar
                </button>
              </div>

              <div
                style={{
                  color: "gray",
                  fontSize: "0.8rem",
                }}
              >
                <div>
                  tags: {note.tags} categ: {note.category}
                </div>
                <div>
                  deleted: {note.deleted} archived: {note.archived}
                </div>
                <div>created: {note.created}</div>
                <div>modified: {note.modified}</div>
                <div>
                  rating: {note.rating} reminder: {note.reminder}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
