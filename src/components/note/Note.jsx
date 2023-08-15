import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";
import { useNotes } from "../../useNotes";
import {
  DeleteFilled,
  ShrinkOutlined,
  SaveFilled,
  RightOutlined,
  ArrowsAltOutlined,
  InfoCircleFilled,
  DownOutlined,
  TagFilled,
} from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import { dateTimeJStoDB, getFormattedDateTime } from "../../utilityFunctions";
import { dbUpdateNote, dbDeleteNote, dbAddNote } from "../../dbHandler";

import "./NoteMasonry.css";
import NoteTags from "./NoteTags";
import { Tooltip } from "antd";

Note.propTypes = {
  note: PropTypes.object,
  noteOverflow: PropTypes.string,
  isNewNote: PropTypes.bool,
  children: PropTypes.node,
  setShowNewNote: PropTypes.func,
  isCollapsed: PropTypes.bool,
};

export function Note({
  note,
  noteOverflow,
  children,
  isNewNote,
  setShowNewNote,
  isCollapsed,
}) {
  //* en general los isNewNote, isEditMode los uso para diferenciar cosas que se hacen en la creación de una nota nueva y en la edición de una nota existente.
  //* isModified lo uso para saber si se ha modificado el contenido de la nota, para saber si hay que mostrar el botón de guardar o no.
  //* isNewNoteSaved lo uso para saber si se ha guardado la nota nueva, para saber si hay que hacer update o guardar por primera vez.
  //* isShowInfo, isShowBody, isShowTags los uso para saber si se muestra o no la info, el cuerpo y los tags de la nota al renderizar el componente.

  const [editNote, setEditNote] = useState(note);
  const [isModified, setIsModified] = useState(false);
  const [isEditMode, setIsEditMode] = useState(isNewNote);
  const [isNewNoteSaved, setIsNewNoteSaved] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isShowInfo, setIsShowInfo] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isShowBody, setIsShowBody] = useState(!isCollapsed);
  const [isShowTags, setIsShowTags] = useState(false);
  const { dispatch } = useNotes();
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

  // hace que cuando se cambia el isCollapsed general, se cambie el isShowBody de cada nota
  useEffect(() => {
    setIsShowBody(!isCollapsed);
  }, [isCollapsed]);

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

    // si la nota es nueva le pone la fecha y hora del momento en que se guarda/crea
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

    // si es una nota nueva y no está guardada la guarda
    if (isNewNote && !isNewNoteSaved) {
      dbAddNote(note);
      setIsNewNoteSaved(true);
    }
    // si no es una nota nueva la actualiza
    else {
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

  function handleTags(tagsArray) {
    // convert an array of tags to a string with comma separated values
    const tagsString = tagsArray.join(", ");
    setEditNote((prev) => {
      return { ...prev, tags: tagsString };
    });
    setIsModified(true);
  }

  //* *** Bloques de JSX de cada note ***

  const noteHeader = (
    <div className="note__header">
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

      <div className="note__header__toolbar">
        {isEditMode && (
          <ShrinkOutlined
            className="note__header__toolbar-icon"
            onClick={handleExitModal}
          />
        )}
        {!isShowBody && (
          <RightOutlined
            className="note__header__toolbar-icon"
            onClick={() => {
              setIsShowBody((prev) => !prev);
            }}
          />
        )}
        {isShowBody && (
          <DownOutlined
            className="note__header__toolbar-icon"
            onClick={() => {
              setIsShowBody((prev) => !prev);
            }}
          />
        )}
        {!isEditMode && (
          <ArrowsAltOutlined
            className="note__header__toolbar-icon"
            onClick={() => {
              setIsShowBody(true);
              setIsEditMode(true);

              inputRef.current.focus();
            }}
          />
        )}
      </div>
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
          setIsShowTags((prev) => !prev);
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

  // lo cambié por el tooltip cola fecha de creación y modificación
  /* const noteInfo = (
    <div
      style={{
        color: "gray",
        fontSize: "0.8rem",
        padding: "0rem 1rem",
      }}
    >
      { tags: {note.tags} | categ: {note.category} | deleted:
        {note.deleted} | archived: {note.archived} | rating:
        {note.rating} | reminder: {note.reminder} |{" "} }
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
  */

  const noteInputTags = (
    <div>
      <NoteTags noteTags={editNote.tags} handleTags={handleTags} />
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

        {/*         {isShowInfo && noteInfo}  */}

        {noteToolbar}

        {children}
      </div>
    </div>
  );
}
