import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbUpdateNote, dbDeleteNote } from "./dbHandler.jsx";
import { getFormattedDateTime, dateTimeJStoDB } from "./utilityFunctions.jsx";
import { useState } from "react";
import PropTypes from "prop-types";

NoteEditModal.propTypes = {
  index: PropTypes.number,
  setShowModal: PropTypes.func,
};

export default function NoteEditModal({ index, setShowModal }) {
  const notes = useNotes();
  console.log("i:", index);
  const [editNote, setEditNote] = useState(notes[index]);
  const dispatch = useNotesDispatch();

  function handleChange(event) {
    setEditNote((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  }

  function handleEditableChange(event) {
    setEditNote((prev) => {
      return {
        ...prev,
        noteText: event.currentTarget.innerText,
        noteHTML: event.currentTarget.innerHTML,
      };
    });
  }
  function handleUpdate() {
    //TODO: completar otros campos
    let noteIndex = index;

    const updatedNote = {
      id: notes[noteIndex].id,
      noteText: editNote.noteText,
      noteHTML: editNote.noteHTML,
      noteTitle: editNote.noteTitle,
      tags: notes[noteIndex].tags, //! cuando se puedan editar tambien cambiar acá
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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
      onClick={() => {
        handleUpdate();
        setShowModal(false);
      }}
    >
      <div
        style={{
          borderRadius: "5px",
          padding: "0.4rem",
          backgroundColor: "white",
          width: "300px",
          margin: "auto",
          marginTop: "1rem",
          position: "relative",
        }}
        className="note_input_container"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <input
          name="noteTitle"
          placeholder="Título..."
          value={editNote.noteTitle}
          onChange={handleChange}
          type="text"
          className="note_editable note_editable_title"
        />
        <ContentEditable
          html={`${editNote.noteHTML}`}
          disabled={false}
          onChange={handleEditableChange}
          data-key={notes[index].id}
          //onBlur={handleUpdate}
          style={{
            height: "100px",
          }}
          className="note_editable"
        />

        <button
          onClick={() => {
            handleUpdate();
            setShowModal(false);
          }}
        >
          cerrar
        </button>
      </div>
    </div>
  );
}
