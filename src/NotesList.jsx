import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbDeleteNote } from "./dbHandler.jsx";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import NoteEditModal from "./NoteEditModal.jsx";
// TODO: remover librerarias si no las voy a usar

import { DeleteFilled } from "@ant-design/icons";

export default function NotesList() {
  const ref = useRef();

  const [notesOver, setNotesOver] = useState();
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState();

  const notes = useNotes();
  const dispatch = useNotesDispatch();

  function handleDelete(event) {
    dispatch({ type: "deleted", deleteId: event.currentTarget.dataset.key });
    dbDeleteNote(event.currentTarget.dataset.key);
  }

  // crea una ref a la lista de notas, luego busca los nodos que tienen el cuerpo de cada nota y se fija si hay overflow o no. Lo devuelve cómo un array de booleanos. El index del array es el index de la nota en Notes. Luego en el render se fija si esa nota tiene overflow y si es así pone los puntitos.
  useLayoutEffect(() => {
    const { current } = ref;
    const noteBodyNodes = Array.from(current.querySelectorAll(".note__body"));
    const isOverflow = noteBodyNodes.map(
      (e) => e.scrollHeight > e.clientHeight
    );

    setNotesOver(isOverflow);
  }, [notes]);

  return (
    <div
      style={{
        display: "grid",
        gap: "0.4rem",
        justifyContent: "center",
        margin: "1rem",
      }}
      ref={ref}
    >
      {showModal ? (
        <NoteEditModal index={editIndex} setShowModal={setShowModal} />
      ) : null}

      {notes &&
        notes.map((note, index) => {
          return (
            <div key={note.id}>
              <div
                className="note__container"
                style={{}}
                onClick={() => {
                  setEditIndex(index);
                  setShowModal(true);
                }}
              >
                <div>
                  <div className="note__title">{note.noteTitle}</div>
                  <ContentEditable
                    html={`${notes[index].noteHTML}`}
                    disabled={true} // use true to disable edition
                    //onChange={handleEditableChange} // handle innerHTML change
                    data-key={note.id}
                    className="note__body sb1"
                  />

                  <div
                    className="note__oo"
                    style={{
                      height: 0,
                    }}
                  >
                    {notesOver[index] ? "..." : null}
                  </div>
                </div>

                <div className="note-toolbar">
                  <DeleteFilled
                    className="note-toolbar__icon"
                    data-key={note.id}
                    onClick={handleDelete}
                  />
                </div>
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
