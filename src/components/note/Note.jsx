import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";
import { DeleteFilled, SaveFilled, ArrowsAltOutlined } from "@ant-design/icons";
import { useState } from "react";
import { dateTimeJStoDB, getFormattedDateTime } from "../../utilityFunctions";
import { dbUpdateNote } from "../../dbHandler";
import { useNotesDispatch } from "../../NotesContext";

Note.propTypes = {
  note: PropTypes.object,
  noteIndex: PropTypes.number,
  noteOverflow: PropTypes.string,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  isModal: PropTypes.bool,
  children: PropTypes.node,
};
export function Note({
  note,
  noteIndex,
  handleEdit,
  handleDelete,
  noteOverflow,
  isModal,
  children,
}) {
  const [editNote, setEditNote] = useState(note);
  const [isEdited, setIsEdited] = useState(false);
  const dispatch = useNotesDispatch();

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
    console.log("UPDATE");
    dispatch({ type: "updated", note: updatedNote });
    dbUpdateNote(updatedNote);
  }
  return (
    <div
      className={`note__container ${isModal && "modal-container"}`}
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
        <ArrowsAltOutlined
          className="note-toolbar__expand-icon"
          onClick={(event) => {
            handleEdit(event, noteIndex);
          }}
        />
      </div>

      <ContentEditable
        html={editNote.noteHTML}
        disabled={false}
        data-key={note.id}
        onChange={handleEditableChange}
        //onBlur={handleUpdate}
        className={`note__body note__body--edit sb1 ${isModal && "modal-body"}`}
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
  );
}
