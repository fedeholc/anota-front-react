import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";
import {
  DeleteFilled,
  ShrinkOutlined,
  SaveFilled,
  ArrowsAltOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { dateTimeJStoDB, getFormattedDateTime } from "../../utilityFunctions";
import { dbUpdateNote } from "../../dbHandler";

Note.propTypes = {
  note: PropTypes.object,
  noteOverflow: PropTypes.string,
  handleDelete: PropTypes.func,
  children: PropTypes.node,
};
export function Note({ note, handleDelete, noteOverflow, children }) {
  const [editNote, setEditNote] = useState(note);
  const [isEdited, setIsEdited] = useState(false);
  const [isModal, setIsModal] = useState(false);

  function handleChange(event) {
    setEditNote((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
    setIsEdited(true);
  }

  function handleEditableChange(event) {
    setEditNote((prev) => {
      return {
        ...prev,
        noteText: event.currentTarget.innerText,
        noteHTML: event.currentTarget.innerHTML,
      };
    });
    setIsEdited(true);
  }

  function handleUpdate() {
    //TODO: completar otros campos

    const updatedNote = {
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

    dbUpdateNote(updatedNote);
  }
  return (
    <div
      onClick={() => setIsModal(false)}
      className={`${isModal && "new-note__background"}`}
    >
      <div
        className={`note__container ${isModal && "modal-container"}`}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseLeave={() => {
          if (isEdited) {
            handleUpdate();
            setIsEdited(false);
          }
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <input
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
              onClick={() => {
                setIsModal(false);
              }}
            />
          )}

          {!isModal && (
            <ArrowsAltOutlined
              className="note-toolbar__expand-icon"
              onClick={() => {
                setIsModal(true);
              }}
            />
          )}
        </div>
        <ContentEditable
          html={editNote.noteHTML}
          disabled={false}
          data-key={note.id}
          onChange={handleEditableChange}
          //onBlur={handleUpdate}
          className={`note__body note__body--edit sb1 ${
            isModal && "modal-body"
          }`}
          //className="note__body note__body--edit sb1 modal"
        />
        <div className="note__overflow">{noteOverflow}</div>
        <div className="note-toolbar">
           <DeleteFilled
            className="note-toolbar__icon"
            data-key={note.id}
            onClick={handleDelete}
          />
          {isEdited && (
            <SaveFilled
              className="note-toolbar__icon--highlight"
              onClick={() => {
                if (isEdited) {
                  handleUpdate();
                  setIsEdited(false);
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
