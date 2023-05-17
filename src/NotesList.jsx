import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbDeleteNote } from "./dbHandler.jsx";
import { useState } from "react";
import NoteEditModal from "./NoteEditModal.jsx";

export default function NotesList() {
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState();

  const notes = useNotes();
  const dispatch = useNotesDispatch();

  function handleDelete(event) {
    dispatch({ type: "deleted", deleteId: event.currentTarget.dataset.key });
    dbDeleteNote(event.currentTarget.dataset.key);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "0.4rem",
        justifyContent: "center",
        margin: "1rem",
      }}
    >
      {showModal ? (
        <NoteEditModal index={editIndex} setShowModal={setShowModal} />
      ) : null}

      {notes &&
        notes.map((note, index) => {
          return (
            <div key={note.id}>
              <div
                style={{
                  border: "1px solid gray",
                  borderRadius: "5px",
                  padding: "0.4rem",
                }}
              >
                <div
                  onClick={() => {
                    setEditIndex(index);
                    setShowModal(true);
                  }}
                >
                  <div>
                    <strong>{note.noteTitle}</strong>
                  </div>
                  <ContentEditable
                    html={`${notes[index].noteHTML}`}
                    disabled={true} // use true to disable edition
                    //onChange={handleEditableChange} // handle innerHTML change
                    data-key={note.id}
                  />
                </div>
                <button data-key={note.id} onClick={handleDelete}>
                  borrar
                </button>
              </div>

              <div
                style={{
                  color: "gray",
                  fontSize: "0.8rem",
                }}
              >
                <div>
                  tags: {note.tags} categ: {note.category}
                </div>
                <div>
                  deleted: {note.deleted} archived: {note.archived}
                </div>
                <div>created: {note.created}</div>
                <div>modified: {note.modified}</div>
                <div>
                  rating: {note.rating} reminder: {note.reminder}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
