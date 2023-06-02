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
  const [isModal, setIsModal] = useState(isNewNote);
  const [isNewNoteSaved, setIsNewNoteSaved] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isShowInfo, setIsShowInfo] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isShowBody, setIsShowBody] = useState(true);
  const [isShowTags, setisShowTags] = useState(false);
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
  function handleKeyDownTitle(event) {
    if (event.key === "Enter") {
      // si estamos creando una nota nueva le pasa el foco al body de la nota
      if (isModal && isNewNote) {
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
          isModal && "modal-body"
        }`}
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
  );

  const noteBody = (
    <ContentEditable
      innerRef={inputRef}
      html={editNote.noteHTML}
      disabled={false}
      data-key={note.id}
      onChange={handleEditableChange}
      className={`note__body note__body--edit sb1 ${isModal && "modal-body"}`}
    />
  );

  const noteOverflowIndicator = (
    <div className="note__overflow">{!isModal && noteOverflow}</div>
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
        <InfoCircleFilled
          className="note-toolbar__icon"

          /* Deshabilitado, lo cambié por tooltip */
          /*  onClick={() => {
            setIsShowInfo((prev) => !prev);
          }} */
        />
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
              handleSave();
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
    console.log(tagsString);
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
