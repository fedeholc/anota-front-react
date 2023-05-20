import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import { dbDeleteNote } from "./dbHandler.jsx";
import { useState, useRef, useLayoutEffect } from "react";
import NoteEditModal2 from "./NoteEditModal2.jsx";
import { Note } from "./components/note/Note.jsx";

export default function NotesList() {
  const ref = useRef();

  const [notesOver, setNotesOver] = useState();
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState();

  const notes = useNotes();
  const dispatch = useNotesDispatch();

  // crea una ref a la lista de notas, luego busca los nodos que tienen el cuerpo de cada nota y se fija si hay overflow o no. Lo devuelve cómo un array de booleanos. El index del array es el index de la nota en Notes. Luego en el render se fija si esa nota tiene overflow y si es así pone los puntitos.
  useLayoutEffect(() => {
    const { current } = ref;
    const noteBodyNodes = Array.from(current.querySelectorAll(".note__body"));
    const isOverflow = noteBodyNodes.map(
      (noteBody) => noteBody.scrollHeight > noteBody.clientHeight
    );
    setNotesOver(isOverflow);
  }, [notes]);

  function handleDelete(event) {
    dispatch({ type: "deleted", deleteId: event.currentTarget.dataset.key });
    dbDeleteNote(event.currentTarget.dataset.key);
    event.stopPropagation();
  }

  function handleEdit(event, noteIndex) {
    console.log("llamo:", noteIndex);
    setEditIndex(noteIndex);
    setShowModal(true);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        justifyContent: "center",
        margin: "1rem",
      }}
      ref={ref}
    >
      {showModal ? (
        <NoteEditModal2 index={editIndex} setShowModal={setShowModal} />
      ) : null}

      {notes &&
        notes.map((note, noteIndex) => {
          return (
            <div key={note.id}>
              <Note
                note={note}
                noteIndex={noteIndex}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                noteOverflow={notesOver[noteIndex] ? "..." : null}
              ></Note>
            </div>
          );
        })}
      <br />
    </div>
  );
}
