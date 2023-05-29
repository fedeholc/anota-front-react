import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { useNotes } from "./NotesContext.jsx";
import { useState, useRef, useLayoutEffect, useContext } from "react";
import { Note } from "./components/note/Note.jsx";
import "./NotesListMasonry.css";
import { NotesFilterContext } from "./NotesContext.jsx";

export default function NotesListMasonry() {
  const ref = useRef();

  const [notesOver, setNotesOver] = useState();

  const notes = useNotes();

  const notesFilter = useContext(NotesFilterContext);

  function handleSearchFilter(note) {
    // hace que si no hay filtro devuelva true
    return (
      note.noteTitle.includes(notesFilter || "") ||
      note.noteText.includes(notesFilter || "")
    );
  }

  // crea una ref a la lista de notas, luego busca los nodos que tienen el cuerpo de cada nota y se fija si hay overflow o no. Lo devuelve cómo un array de booleanos. El index del array es el index de la nota en Notes. Luego en el render se fija si esa nota tiene overflow y si es así pone los puntitos.
  useLayoutEffect(() => {
    const { current } = ref;
    const noteBodyNodes = Array.from(current.querySelectorAll(".note__body"));

    // crea un array con los ids de las notas que tienen overflow
    const overIds = noteBodyNodes.map((noteBody) =>
      noteBody.scrollHeight > noteBody.clientHeight
        ? noteBody.dataset.key
        : null
    );
    setNotesOver(overIds);
  }, [notes]);
 
   // TODO: ver los breakpoints
  // https://www.npmjs.com/package/react-responsive-masonry

  return (
    <div ref={ref} style={{ padding: "1rem", margin: "auto" }}>
      {notes && (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 650: 2, 950: 3, 1200: 4 }}
        >
          <Masonry gutter="1rem" columnsCount={3}>
            {notes.filter(handleSearchFilter).map((note) => {
              return (
                <div key={note.id}>
                  <Note
                    note={note}
                    // si el id de la nota está en el array de ids que tienen overflow, entonces pone los puntitos
                    noteOverflow={
                      notesOver.some((e) => e === note.id) ? "..." : null
                    }
                  ></Note>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
}
