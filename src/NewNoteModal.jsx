import { useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { getFormattedDateTime } from "./utilityFunctions.jsx";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { dbAddNote } from "./dbHandler.jsx";

NewNoteModal.propTypes = {
  setShowModal: PropTypes.func,
};

export default function NewNoteModal({ setShowModal }) {
  const [newNote, setNewNote] = useState({
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

  const dispatch = useNotesDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  function handleChange(event) {
    setNewNote((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  }

  function handleEditableChange(event) {
    setNewNote((prev) => {
      return {
        ...prev,
        noteText: event.currentTarget.innerText,
        noteHTML: event.currentTarget.innerHTML,
      };
    });
  }

  function handleGuardar() {
    if (newNote.noteTitle !== "" || newNote.noteHTML != "") {
      const noteToAdd = {
        id: uuidv4(),
        noteText: newNote.noteText,
        noteHTML: newNote.noteHTML,
        noteTitle: newNote.noteTitle,
        tags: "bla, otra",
        category: "caaat",
        deleted: 0,
        archived: 0,
        reminder: "default",
        rating: 0,
        created: getFormattedDateTime(),
        modified: getFormattedDateTime(),
      };
      dispatch({ type: "added", note: noteToAdd });
      
      dbAddNote(noteToAdd);
    }
  }

  return (
    <div
      className="new-note__background"
      onClick={() => {
        handleGuardar();
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
          value={newNote.noteTitle}
          onChange={handleChange}
          type="text"
          className="new-note__title"
        />
        <ContentEditable
          innerRef={inputRef}
          html={`${newNote.noteHTML}`}
          disabled={false}
          onChange={handleEditableChange}
          //onBlur={handleUpdate}
          className="new-note__body"
        />

        <button
          onClick={() => {
            handleGuardar();
            setShowModal(false);
          }}
        >
          cerrar
        </button>
      </div>
    </div>
  );
}
