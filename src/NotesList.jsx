import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { dbDeleteNote } from "./dbHandler.jsx";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import NoteEditModal from "./NoteEditModal.jsx";
import { useIsOverflow } from "./utilityFunctions.jsx";
// TODO: remover librerarias si no las voy a usar

import { DeleteFilled } from "@ant-design/icons";

export default function NotesList() {
  const ref = useRef();
  const isOverflow = useIsOverflow(ref, (isOverflowFromCallback) => {
    //console.log("from callback", isOverflowFromCallback);
  });
  //console.log(isOverflow);

  const [notesOver, setNotesOver] = useState();
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState();

  const notes = useNotes();
  const dispatch = useNotesDispatch();

  function handleDelete(event) {
    dispatch({ type: "deleted", deleteId: event.currentTarget.dataset.key });
    dbDeleteNote(event.currentTarget.dataset.key);
  }

  useLayoutEffect(() => {
    console.log("holi");
    const { current } = ref;

    const divs = current.querySelectorAll(".note__body");
    const miarr = Array.from(divs);
    let fede = miarr.map((e) => e.scrollHeight > e.clientHeight);

    console.log("divs:", divs);
    console.log("miarr", fede);
    setNotesOver(fede);
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
                    className="note__body"
                  />

                  {/* TODO: no me convence del todo, probar con ... en algún lado */}
                  <div
                    className="note__oo"
                    style={{
                      height: 0,
                    }}
                  >
                    {notesOver[index] ? "↕️" : null}
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
