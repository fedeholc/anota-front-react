import { useNotes } from "./NotesContext.jsx";
import { useState, useRef, useLayoutEffect } from "react";
import { Note } from "./components/note/Note.jsx";
import "./NotesList.css"

export default function NotesList() {
  const ref = useRef();

  const [notesOver, setNotesOver] = useState();

  const notes = useNotes();

  // crea una ref a la lista de notas, luego busca los nodos que tienen el cuerpo de cada nota y se fija si hay overflow o no. Lo devuelve cómo un array de booleanos. El index del array es el index de la nota en Notes. Luego en el render se fija si esa nota tiene overflow y si es así pone los puntitos.
  useLayoutEffect(() => {
    const { current } = ref;
    const noteBodyNodes = Array.from(current.querySelectorAll(".note__body"));
    const isOverflow = noteBodyNodes.map(
      (noteBody) => noteBody.scrollHeight > noteBody.clientHeight
    );
    setNotesOver(isOverflow);
  }, [notes]);

  return (
    <div className="note-list__grid" ref={ref}>
      {notes &&
        notes.map((note, noteIndex) => {
          return (
            <div key={note.id}>
              <Note
                note={note}
                noteOverflow={notesOver[noteIndex] ? "..." : null}
              ></Note>
            </div>
          );
        })}
    </div>
  );
}
