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
import { Tooltip } from "antd";
import { useState, useRef, useEffect } from "react";
import { dateTimeJStoDB, getFormattedDateTime } from "../../utilityFunctions";
import { dbUpdateNote, dbDeleteNote } from "../../dbHandler";
import "./Note.css";
import NoteTags from "./NoteTags";
import { createContext, useContext } from "react";

const NoteContext = createContext();

Note.propTypes = {
  note: PropTypes.object.isRequired,
  noteOverflow: PropTypes.string.isRequired,
  isNewNote: PropTypes.bool.isRequired,
  children: PropTypes.node,
  setShowNewNote: PropTypes.func,
  isCollapsed: PropTypes.bool.isRequired,
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
  //* isShowInfo, isShowBody, isShowTags los uso para saber si se muestra o no la info, el cuerpo y los tags de la nota al renderizar el componente.
  const [editNote, setEditNote] = useState(note);
  const [isModified, setIsModified] = useState(false);
  const [isEditMode, setIsEditMode] = useState(isNewNote);
  const [isShowBody, setIsShowBody] = useState(!isCollapsed);
  const [isShowTags, setIsShowTags] = useState(false);
  const { dispatch } = useNotes(); // ref para cuando se está editando una nota
  const bodyInputRef = useRef(null); // ref para cuando se está creando una nota nueva
  const titleInputRef = useRef(null);
  const [isNew, setIsNew] = useState(isNewNote);

  // useEffects
  useEffect(() => {
    if (isNew) {
      titleInputRef.current.focus();
    }
    setIsNew(false);
  }, [isNew]);

  useEffect(() => {
    setIsShowBody(!isCollapsed);
  }, [isCollapsed]);

  // handlers
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

  function handleSaveEdit() {
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

    //dispatch({ type: "updated", note: note });
    //no hace falta hacer el dispatch porque ya se hizo en el handleEditableChange el update. Y por otra parte, el dispatch dispara el rerender con lo cual se cerraba la nota estando en modo edición.

    dbUpdateNote(note);
  }

  function handleKeyDownTitle(event) {
    if (event.key === "Enter") {
      // si no hay texto en el cuerpo de la nota pasa el foco ahí
      if (note.noteText === "") {
        event.preventDefault(); // evita que se agregue un enter al comienzo del body de la nota
        bodyInputRef.current.focus();
      }
      // si no simplemente saca el foco del titulo
      else {
        titleInputRef.current.blur();
      }
    }
  }

  function handleDelete(id) {
    dispatch({ type: "deleted", deleteId: id });
    dbDeleteNote(id);
    isEditMode && setShowNewNote(false);
    setIsModified(false);
    setIsEditMode(false);
  }

  function handleExitModal() {
    setShowNewNote && setShowNewNote(false); //para que no de error si no se pasó el parámetro
    setIsModified(false);
    setIsEditMode(false);
    handleSaveEdit();
  }

  function handleTags(tagsArray) {
    // convert an array of tags to a string with comma separated values
    const tagsString = tagsArray.join(", ");
    setEditNote((prev) => {
      return { ...prev, tags: tagsString };
    });
    setIsModified(true);
  }

  return (
    <NoteContext.Provider
      value={{
        setIsShowTags,
        note,
        editNote,
        titleInputRef,
        bodyInputRef,
        handleTitleEditableChange,
        handleKeyDownTitle,
        handleExitModal,
        handleDelete,
        handleSaveEdit,
        isEditMode,
        setIsEditMode,
        isModified,
        setIsModified,
        isShowBody,
        setIsShowBody,
      }}
    >
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
          <NoteHeader />

          {isShowBody && (
            <ContentEditable
              innerRef={bodyInputRef}
              html={editNote.noteHTML}
              disabled={false}
              data-key={note.id}
              onChange={handleEditableChange}
              className={`note__body note__body--edit sb1 ${
                isEditMode && "modal-body"
              }`}
            />
          )}

          {isShowBody && !isEditMode && (
            <NoteOverflowIndicator noteOverflow={noteOverflow} />
          )}
          {isShowTags && (
            <NoteTags noteTags={editNote.tags} handleTags={handleTags} />
          )}

          <NoteToolbar />
          {children}
        </div>
      </div>
    </NoteContext.Provider>
  );
}

function NoteToolbar() {
  const {
    setIsShowTags,
    note,
    handleDelete,
    isModified,
    handleSaveEdit,
    setIsModified,
  } = useContext(NoteContext);

  // prettier-ignore
  const tooltipText = `Creada: ${note.created.substring(0,10)} ${note.created.substring(11, 16)}hs
  Modificada: ${note.modified.substring(0, 10)} ${note.modified.substring(11,16)}hs`;

  return (
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
}

NoteOverflowIndicator.propTypes = {
  noteOverflow: PropTypes.string.isRequired,
};
function NoteOverflowIndicator({ noteOverflow }) {
  return <div className="note__overflow">{noteOverflow}</div>;
}

function NoteHeader() {
  const {
    titleInputRef,
    note,
    editNote,
    handleTitleEditableChange,
    handleKeyDownTitle,
    isEditMode,
    handleExitModal,
    isShowBody,
    setIsShowBody,
    setIsEditMode,
    bodyInputRef,
  } = useContext(NoteContext);
  return (
    <div className="note__header">
      <ContentEditable
        innerRef={titleInputRef}
        html={editNote.noteTitle}
        disabled={false}
        data-key={note.id}
        onChange={handleTitleEditableChange}
        onKeyDown={handleKeyDownTitle}
        className={`note__input-title    sb1 ${isEditMode && "modal-body"}`}
      />

      <div className="note__header__toolbar">
        {isShowBody && (
          <DownOutlined
            className="note__header__toolbar-icon"
            onClick={() => {
              setIsShowBody((prev) => !prev);
            }}
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
        {!isEditMode && (
          <ArrowsAltOutlined
            className="note__header__toolbar-icon"
            onClick={() => {
              setIsShowBody(true);
              setIsEditMode(true);
              bodyInputRef.current.focus();
            }}
          />
        )}
        {isEditMode && (
          <ShrinkOutlined
            className="note__header__toolbar-icon"
            onClick={handleExitModal}
          />
        )}
      </div>
    </div>
  );
}
