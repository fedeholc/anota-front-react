import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbUpdateNote } from "./dbHandler.jsx";
import { getFormattedDateTime, dateTimeJStoDB } from "./utilityFunctions.jsx";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

NoteEditModal.propTypes = {
  index: PropTypes.number,
  setShowModal: PropTypes.func,
};

export default function NoteEditModal({ index, setShowModal }) {
  const notes = useNotes();
  const dispatch = useNotesDispatch();
  const [editNote, setEditNote] = useState(notes[index]);

  const inputRef = useRef(null);

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

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div
      className="new-note__background"
      onClick={() => {
        handleUpdate();
        setShowModal(false);
      }}
    >
      <div
        className="new-note__container"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <input
          name="noteTitle"
          placeholder="¿Título...?"
          value={editNote.noteTitle}
          onChange={handleChange}
          type="text"
          className="new-note__title"
        />

        <ContentEditable
          innerRef={inputRef}
          html={`${editNote.noteHTML}`}
          disabled={false}
          onChange={handleEditableChange}
          data-key={notes[index].id}
          //onBlur={handleUpdate}
          className="new-note__body"
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
