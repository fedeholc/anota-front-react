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
import { dbUpdateNote, dbDeleteNote } from "../../dbHandler";
import "./NoteMasonry.css";
import NoteTags from "./NoteTags";
import { Tooltip } from "antd";

Note2.propTypes = {
  note: PropTypes.object,
  noteOverflow: PropTypes.string,
  isNewNote: PropTypes.bool,
  children: PropTypes.node,
  setShowNewNote: PropTypes.func,
  isCollapsed: PropTypes.bool,
};

export function Note2({
  note,
  noteOverflow,
  children,
  isNewNote,
  setShowNewNote,
  isCollapsed,
}) {
  //* en general los isNewNote, isEditMode los uso para diferenciar cosas que se hacen en la creación de una nota nueva y en la edición de una nota existente.
  //* isModified lo uso para saber si se ha modificado el contenido de la nota, para saber si hay que mostrar el botón de guardar o no.
  //* isShowInfo, isShowBody, isShowTags los uso para saber si se muestra o no la info, el cuerpo y los tags de la nota al renderizar el componente.

  const [editNote, setEditNote] = useState(note);
  const [isModified, setIsModified] = useState(false);
  const [isEditMode, setIsEditMode] = useState(isNewNote);
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

  // pone el foco en el título de la nota cuando no tiene texto
  // y sino en el cuerpo
  useEffect(() => {
    if (note.noteTitle === "") {
      newNoteInputRef.current.focus();
    } else {
      inputRef.current.focus();
    }
  }, [note.noteTitle]);

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

  async function handleSaveEdit() {
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

    dispatch({ type: "updated", note: note });
    dbUpdateNote(note);
  }

  function handleKeyDownTitle(event) {
    if (event.key === "Enter") {
      // si no hay texto en el cuerpo de la nota pasa el foco ahí
      if (note.noteText === "") {
        event.preventDefault(); // evita que se agregue un enter al comienzo del body de la nota
        inputRef.current.focus();
      }
      // si no simplemente saca el foco del titulo
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
    handleSaveEdit();

    setShowNewNote && setShowNewNote(false); //para que no de error si no se pasó el parámetro

    setIsModified(false);
    setIsEditMode(false);
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

        {noteToolbar}

        {children}
      </div>
    </div>
  );
}
