import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";
import { useNotesDispatch } from "../../NotesContextHooks";
import {
  DeleteFilled,
  ShrinkOutlined,
  SaveFilled,
  ArrowsAltOutlined,
  InfoCircleFilled,
  TagFilled,
} from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import { dateTimeJStoDB, getFormattedDateTime } from "../../utilityFunctions";
import { dbUpdateNote, dbDeleteNote, dbAddNote } from "../../dbHandler";

import "./NoteMasonry.css";
import Tags from "../Tags";
import { Tooltip } from "antd";

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
  const [isEditMode, setIsEditMode] = useState(isNewNote);
  const [isNewNoteSaved, setIsNewNoteSaved] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isShowInfo, setIsShowInfo] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isShowBody, setIsShowBody] = useState(true);
  const [isShowTags, setisShowTags] = useState(false);
  const dispatch = useNotesDispatch();

  // ref para cuando se está editando una nota
  const inputRef = useRef(null);

  // ref para cuando se está creando una nota nueva
  const newNoteInputRef = useRef(null);

  // pone el foco en el título de la nota cuando se crea una nueva nota (isNewNote)
  // y en el cuerpo cuando es edición (isEditMode)
  useEffect(() => {
    if (isNewNote) {
      newNoteInputRef.current.focus();
    } else {
      if (isEditMode) {
        inputRef.current.focus();
      }
    }
  }, [isNewNote, isEditMode]);

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

  function handleTitleEditableChange(event) {
    //! ojo, al guardar el innerText no guarda los saltos de linea, ver si queremos que los guarde o no.
    setEditNote((prev) => {
      return {
        ...prev,
        noteTitle: event.currentTarget.innerText,
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
        tags: editNote.tags,
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

  function handleSaveEdit() {
    //TODO: completar otros campos

    if (isNewNote) {
      editNote.created = getFormattedDateTime();
    }
    const note = {
      id: editNote.id,
      noteText: editNote.noteText,
      noteHTML: editNote.noteHTML,
      noteTitle: editNote.noteTitle,
      tags: editNote.tags,
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
  function handleKeyDownTitle(event) {
    if (event.key === "Enter") {
      // si estamos creando una nota nueva le pasa el foco al body de la nota
      if (isEditMode && isNewNote) {
        // evita que se agregue un enter al comienzo del body de la nota
        event.preventDefault();
        inputRef.current.focus();
      }
      // si no es una nota nueva simplemente saca el foco del titulo
      else {
        newNoteInputRef.current.blur();
      }
    }
  }

  function handleDelete(id) {
    dispatch({ type: "deleted", deleteId: id });
    dbDeleteNote(id);
    if (isNewNote) {
      setShowNewNote(false);
      setIsEditMode(false);
    } else {
      setIsModified(false);
      setIsEditMode(false);
    }
  }

  function handleExitModal() {
    if (isNewNote) {
      saveNewNote();
      setShowNewNote(false);
      setIsEditMode(false);
    } else {
      handleSaveEdit();
      setIsModified(false);
      setIsEditMode(false);
    }
  }

  const noteHeader = (
    <div className="note__header">
      {/* FIXME: al ampliar la nota hacer que vaya el foco si estaba ahí */}
      <ContentEditable
        innerRef={newNoteInputRef}
        html={editNote.noteTitle}
        disabled={false}
        data-key={note.id}
        onChange={handleTitleEditableChange}
        onKeyDown={handleKeyDownTitle}
        className={`note__input-title note__body note__body--edit sb1 ${
          isEditMode && "modal-body"
        }`}
      />
      {isEditMode && (
        <ShrinkOutlined
          className="note-toolbar__expand-icon"
          onClick={handleExitModal}
        />
      )}

      {!isEditMode && (
        <ArrowsAltOutlined
          className="note-toolbar__expand-icon"
          onClick={() => {
            inputRef.current.focus();
            setIsEditMode(true);
          }}
        />
      )}
    </div>
  );

  const noteBody = (
    <ContentEditable
      innerRef={inputRef}
      html={editNote.noteHTML}
      disabled={false}
      data-key={note.id}
      onChange={handleEditableChange}
      className={`note__body note__body--edit sb1 ${
        isEditMode && "modal-body"
      }`}
    />
  );

  const noteOverflowIndicator = (
    <div className="note__overflow">{!isEditMode && noteOverflow}</div>
  );

  const tooltipText = `Creada: ${note.created.substring(
    0,
    10
  )} ${note.created.substring(11, 16)}hs
  Modificada: ${note.modified.substring(0, 10)} ${note.modified.substring(
    11,
    16
  )}hs`;

  const noteToolbar = (
    <div className="note-toolbar">
      <Tooltip placement="right" title={tooltipText}>
        <InfoCircleFilled className="note-toolbar__icon" />
      </Tooltip>

      <TagFilled
        className="note-toolbar__icon"
        onClick={() => {
          setisShowTags((prev) => !prev);
        }}
      />

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
              handleSaveEdit();
              setIsModified(false);
            }
          }}
        />
      )}
    </div>
  );

  const noteInfo = (
    <div
      style={{
        color: "gray",
        fontSize: "0.8rem",
        padding: "0rem 1rem",
      }}
    >
      {/* tags: {note.tags} | categ: {note.category} | deleted:
        {note.deleted} | archived: {note.archived} | rating:
        {note.rating} | reminder: {note.reminder} |{" "} */}
      <div>
        Creada: {note.created.substring(0, 10)} {note.created.substring(11, 16)}
        hs
      </div>
      <div>
        Modificada: {note.modified.substring(0, 10)}{" "}
        {note.modified.substring(11, 16)}hs
      </div>
    </div>
  );

  function handleTags(tagsArray) {
    // convert an array of tags to a string with comma separated values
    const tagsString = tagsArray.join(", ");
    setEditNote((prev) => {
      return { ...prev, tags: tagsString };
    });
    setIsModified(true);
  }

  const noteInputTags = (
    <div>
      <Tags noteTags={editNote.tags} handleTags={handleTags} />
    </div>
  );

  return (
    <div
      onClick={handleExitModal}
      className={`${isEditMode && "new-note__background"}`}
    >
      <div
        className={`note__container ${isEditMode && "modal-container"}`}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseLeave={() => {
          if (isModified) {
            handleSaveEdit();
            setIsModified(false);
          }
        }}
      >
        {noteHeader}
        {isShowBody && noteBody}

        {isShowBody && noteOverflowIndicator}

        {isShowTags && noteInputTags}

        {isShowInfo && noteInfo}

        {noteToolbar}

        {children}
      </div>
    </div>
  );
}
