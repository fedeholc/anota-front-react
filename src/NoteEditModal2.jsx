import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbUpdateNote } from "./dbHandler.jsx";
import { getFormattedDateTime, dateTimeJStoDB } from "./utilityFunctions.jsx";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Note } from "./components/note/Note.jsx";

NoteEditModal2.propTypes = {
  index: PropTypes.number,
  setShowModal: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  handleUpModal: PropTypes.func,
};

//! PROBLEMA: el notes queda actualizado pero no se actualiza la nota en pantalla
//TODO probar o bien forzar un refresh de algun modo (ver lo de syncflush)
// o probar scar el modal del componente y ponerlo a nivel del notelist.
// o que el modal sea el mismo coso que se agranda y pone fondo negro y luego vuelve a a su tamaño.
export default function NoteEditModal2({
  index,
  setShowModal,
  handleEdit,
  handleDelete,
  handleUpModal,
}) {
  const notes = useNotes();
  const dispatch = useNotesDispatch();
  const [editNote, setEditNote] = useState(notes[index]);

  return (
    <div
      className="new-note__background"
      onClick={() => {
        console.log("ff", notes, editNote);
        dispatch({ type: "updated", note: editNote });
        console.log("final:", notes);

        setShowModal(false);
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          onClick={(event) => {
            console.log("click");
            event.stopPropagation();
          }}
        >
          <Note
            note={editNote}
            setEditNoteModal={setEditNote}
            noteIndex={index}
            isModal={true}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleUpModal={handleUpModal}
            //noteOverflow={notesOver[noteIndex] ? "..." : null}
          ></Note>
        </div>
      </div>
    </div>
  );
}
