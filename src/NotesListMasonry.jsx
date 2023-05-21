import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { useNotes } from "./NotesContext.jsx";
import { useState, useRef, useLayoutEffect } from "react";
import { Note } from "./components/note/Note.jsx";
import "./NotesListMasonry.css";

export default function NotesListMasonry() {
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

  //TODO: ojo, crear distintos archivos css para agregar masonry y conservar el anterior.
  //TODO: ver que el icono superior derecho no se achique de tamaño.
  // ver los breakpoints
  // https://www.npmjs.com/package/react-responsive-masonry

  return (
    <div ref={ref} style={{ padding: "1rem", margin: "auto" }}>
      {notes && (
        <ResponsiveMasonry
         
          columnsCountBreakPoints={{ 350: 1, 650: 2, 950: 3, 1200: 4 }}
        >
          <Masonry gutter="1rem" columnsCount={3}>
            {notes.map((note, noteIndex) => {
              return (
                <div key={note.id}>
                  <Note
                    note={note}
                    noteOverflow={notesOver[noteIndex] ? "..." : null}
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
