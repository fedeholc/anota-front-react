import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";
import { useNotesDispatch } from "../../NotesContext";
import {
  DeleteFilled,
  ShrinkOutlined,
  SaveFilled,
  ArrowsAltOutlined,
} from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import { dateTimeJStoDB, getFormattedDateTime } from "../../utilityFunctions";
import { dbUpdateNote, dbDeleteNote, dbAddNote } from "../../dbHandler";

import "./NoteMasonry.css";

Note.propTypes = {
  note: PropTypes.object,
  noteOverflow: PropTypes.string,
  isNewNote: PropTypes.bool,
  children: PropTypes.node,
  setShowNewNote: PropTypes.func,
};
export function Note({
  note,
  noteOverflow,
  children,
  isNewNote,
  setShowNewNote,
}) {
  const [editNote, setEditNote] = useState(note);
  const [isModified, setIsModified] = useState(false);
  const [isModal, setIsModal] = useState(isNewNote);
  const [isNewNoteSaved, setIsNewNoteSaved] = useState(false);
  const dispatch = useNotesDispatch();

  const inputRef = useRef(null);
  const newNoteInputRef = useRef(null);

  useEffect(() => {
    if (isNewNote) {
      newNoteInputRef.current.focus();
    } else {
      if (isModal) {
        inputRef.current.focus();
      }
    }
  }, [isNewNote, isModal]);

  function handleChange(event) {
    setEditNote((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
    setIsModified(true);
  }

  function handleEditableChange(event) {
    setEditNote((prev) => {
      return {
        ...prev,
        noteText: event.currentTarget.innerText,
        noteHTML: event.currentTarget.innerHTML,
      };
    });
    setIsModified(true);
  }

  function saveNewNote() {
    dispatch({
      type: "added",
      note: {
        id: editNote.id,
        noteText: editNote.noteText,
        noteHTML: editNote.noteHTML,
        noteTitle: editNote.noteTitle,
        tags: editNote.tags, //! cuando se puedan editar tambien cambiar acá
        category: editNote.category,
        deleted: editNote.deleted,
        archived: editNote.archived,
        reminder: editNote.reminder,
        rating: editNote.rating,
        //FIXME: ojo, esto está porque cuando viene la fecha en formato JSON lo hace así 2023-05-14T14:32:50.000Z en lugar de como la pide para ser guardada. Ver si mejor cambiarla cuando se cargan los datos para que ya quede.
        created: dateTimeJStoDB(editNote.created),
        modified: getFormattedDateTime(),
      },
    });
  }

  function handleSave() {
    //TODO: completar otros campos

    if (isNewNote) {
      editNote.created = getFormattedDateTime();
    }
    const note = {
      id: editNote.id,
      noteText: editNote.noteText,
      noteHTML: editNote.noteHTML,
      noteTitle: editNote.noteTitle,
      tags: editNote.tags, //! cuando se puedan editar tambien cambiar acá
      category: editNote.category,
      deleted: editNote.deleted,
      archived: editNote.archived,
      reminder: editNote.reminder,
      rating: editNote.rating,
      //FIXME: ojo, esto está porque cuando viene la fecha en formato JSON lo hace así 2023-05-14T14:32:50.000Z en lugar de como la pide para ser guardada. Ver si mejor cambiarla cuando se cargan los datos para que ya quede.
      created: dateTimeJStoDB(editNote.created),
      modified: getFormattedDateTime(),
    };

    if (isNewNote && !isNewNoteSaved) {
      dbAddNote(note);
      setIsNewNoteSaved(true);
    } else {
      dispatch({ type: "updated", note: note });
      dbUpdateNote(note);
    }
  }

  function handleDelete(id) {
    dispatch({ type: "deleted", deleteId: id });
    dbDeleteNote(id);
    if (isNewNote) {
      setShowNewNote(false);
      setIsModal(false);
    } else {
      setIsModified(false);
      setIsModal(false);
    }
  }

  function handleExitModal() {
    if (isNewNote) {
      saveNewNote();
      setShowNewNote(false);
      setIsModal(false);
    } else {
      handleSave();
      setIsModified(false);
      setIsModal(false);
    }
  }
  return (
    <div
      onClick={handleExitModal}
      className={`${isModal && "new-note__background"}`}
    >
      <div
        className={`note__container ${isModal && "modal-container"}`}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseLeave={() => {
          if (isModified) {
            handleSave();
            setIsModified(false);
          }
        }}
      >
        <div className="note__header">
          <input
            ref={newNoteInputRef}
            name="noteTitle"
            placeholder="¿Título...?"
            value={editNote.noteTitle}
            onChange={handleChange}
            type="text"
            className="note__input-title"
          />
          {isModal && (
            <ShrinkOutlined
              className="note-toolbar__expand-icon"
              onClick={handleExitModal}
            />
          )}

          {!isModal && (
            <ArrowsAltOutlined
              className="note-toolbar__expand-icon"
              onClick={() => {
                inputRef.current.focus();
                setIsModal(true);
              }}
            />
          )}
        </div>
        <ContentEditable
          innerRef={inputRef}
          html={editNote.noteHTML}
          disabled={false}
          data-key={note.id}
          onChange={handleEditableChange}
          className={`note__body note__body--edit sb1 ${
            isModal && "modal-body"
          }`}
        />
        <div className="note__overflow">{!isModal && noteOverflow}</div>
        <div className="note-toolbar">
          <DeleteFilled
            className="note-toolbar__icon"
            data-key={note.id}
            onClick={() => handleDelete(note.id)}
          />
          {isModified && (
            <SaveFilled
              className="note-toolbar__icon--highlight"
              onClick={() => {
                if (isModified) {
                  handleSave();
                  setIsModified(false);
                }
              }}
            />
          )}
        </div>
        {/*  <div
          style={{
            color: "gray",
            fontSize: "0.8rem",
          }}
        >
          <div>
            tags: {note.tags} | categ: {note.category} | deleted:
            {note.deleted} | archived: {note.archived} | rating:
            {note.rating} | reminder: {note.reminder} |{" "}
            <div>created: {note.created}</div>
            <div>modified: {note.modified}</div>
          </div>
        </div> */}
        {children}
      </div>
    </div>
  );
}
