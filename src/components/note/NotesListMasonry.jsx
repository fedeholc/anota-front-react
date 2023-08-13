import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getTagsArray } from "../../utilityFunctions.jsx";
import { useNotes } from "../../NotesContextHooks.jsx";
import { useState, useRef, useLayoutEffect, useContext } from "react";
import { Note } from "./Note.jsx";
import "./NotesListMasonry.css";
import { NotesFilterContext, NotesLayoutContext } from "../../NotesContext.jsx";

import PropTypes from "prop-types";

NotesListMasonry.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

export default function NotesListMasonry({ isCollapsed }) {
  const ref = useRef();

  const [notesOver, setNotesOver] = useState([false]);

  const notes = useNotes();

  const notesFilter = useContext(NotesFilterContext);
  const notesLayout = useContext(NotesLayoutContext);

  function handleSearchFilter(note) {
    let passedTextFilter = "";
    let passedTagFilter = "";

    // si hay filtro de etiquetas y hay etiquetas en la nota, entonces se fija si la nota tiene todas las etiquetas del filtro
    if (notesFilter.tags.length > 0) {
      passedTagFilter = false;

      const noteTags = getTagsArray(note.tags);

      // check if noteTags contains all of the tags in notesFilter.tags, if that ocurrs, passedTagFilter = true else passedTagFilter = false and stop checking
      notesFilter.tags.forEach((tag) => {
        if (noteTags.includes(tag)) {
          passedTagFilter = true;
        } else {
          passedTagFilter = false;
          return;
        }
      });
    } else {
      passedTagFilter = true;
    }

    // si hay filtro de texto, se fija si el titulo o el texto de la nota contienen el texto del filtro
    if (notesFilter.text) {
      passedTextFilter =
        note.noteTitle.includes(notesFilter.text || "") ||
        note.noteText.includes(notesFilter.text || "");
    } else {
      passedTextFilter = true;
    }

    return passedTextFilter && passedTagFilter;
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

  return (
    <div ref={ref} style={{ padding: "1rem", margin: "auto" }}>
      {notes && notesLayout === 0 && (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 650: 2, 950: 3, 1200: 4 }}
        >
          <Masonry gutter="1rem" columnsCount={3}>
            {notes.filter(handleSearchFilter).map((note) => {
              return (
                <div key={note.id}>
                  <Note
                    isCollapsed={isCollapsed}
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

      {notes && notesLayout === 1 && (
        <Masonry
          gutter="1rem"
          columnsCount={1}
          className="masonry-list__container"
        >
          {notes.filter(handleSearchFilter).map((note) => {
            return (
              <div key={note.id}>
                <Note
                  isCollapsed={isCollapsed}
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
      )}
    </div>
  );
}
