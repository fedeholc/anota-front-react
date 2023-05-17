import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbUpdateNote, dbDeleteNote } from "./dbHandler.jsx";
import { getFormattedDateTime, dateTimeJStoDB } from "./utilityFunctions.jsx";
import { useState } from "react";
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
        deleted: false,
        archived: true,
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
        handleGuardar();
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
          value={newNote.noteTitle}
          onChange={handleChange}
          type="text"
          className="note_editable note_editable_title"
        />
        <ContentEditable
          html={`${newNote.noteHTML}`}
          disabled={false}
          onChange={handleEditableChange}
          //onBlur={handleUpdate}
          style={{
            height: "100px",
          }}
          className="note_editable"
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
