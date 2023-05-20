import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";
import { DeleteFilled } from "@ant-design/icons";

Note.propTypes = {
  note: PropTypes.object,
  noteIndex: PropTypes.number,
  noteOverflow: PropTypes.string,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  children: PropTypes.node,
};
export function Note({
  note,
  noteIndex,
  handleEdit,
  handleDelete,
  noteOverflow,
  children,
}) {
  return (
    <div
      className="note__container"
      onClick={(event) => {
        handleEdit(event, noteIndex);
      }}
    >
      <div className="note__title">{note.noteTitle}</div>
      <ContentEditable
        html={note.noteHTML}
        disabled={true}
        //onChange={handleEditableChange}
        data-key={note.id}
        className="note__body sb1"
      />
      <div className="note__overflow">{noteOverflow}</div>
      <div className="note-toolbar">
        <DeleteFilled
          className="note-toolbar__icon"
          data-key={note.id}
          onClick={handleDelete}
        />
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
