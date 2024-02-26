import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getTagsArray } from "../../utilityFunctions.jsx";
import { useNotes } from "../../useNotes.jsx";
import { useState, useRef, useLayoutEffect, useContext } from "react";
import "./NotesListMasonry.css";
import { NotesFilterContext, NotesLayoutContext } from "../../context.jsx";

import PropTypes from "prop-types";
import { Note } from "./Note.jsx";

import { LoginContext, SetLoginContext } from "../../context";

NotesListMasonry.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

export default function NotesListMasonry({ isCollapsed }) {
  const ref = useRef();

  const [notesOver, setNotesOver] = useState([false]);

  const { notes } = useNotes();

  const notesFilter = useContext(NotesFilterContext);
  const notesLayout = useContext(NotesLayoutContext);
  const loginInfo = useContext(LoginContext);

  console.log("notes:", notes);
  function handleSearchFilter(note) {
    let passedTextFilter = true;
    let passedTagFilter = true;

    if (notesFilter.tags.length > 0) {
      const noteTags = getTagsArray(note.tags);
      // check if noteTags contains all of the tags in notesFilter.tags
      notesFilter.tags.forEach((tag) => {
        if (!noteTags.includes(tag)) {
          passedTagFilter = false;
        }
      });
    }

    // si hay filtro de texto, se fija si el titulo o el texto de la nota contienen el texto del filtro
    if (notesFilter.text) {
      passedTextFilter =
        note.noteTitle.includes(notesFilter.text || "") ||
        note.noteText.includes(notesFilter.text || "");
      console.log(
        notesFilter.text,
        passedTextFilter,
        note.noteTitle,
        note.noteText
      );
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
      {loginInfo && notes && notesLayout === 0 && (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 650: 2, 950: 3, 1200: 4 }}
        >
          <Masonry gutter="1rem" columnsCount={3}>
            {notes.filter(handleSearchFilter).map((note) => {
              return (
                <div key={`${note.id} ${note.modified}`}>
                  <Note
                    isCollapsed={isCollapsed}
                    note={note}
                    // si el id de la nota está en el array de ids que tienen overflow, entonces pone los puntitos
                    noteOverflow={
                      notesOver.some((e) => e === note.id) ? "..." : ""
                    }
                    isNewNote={false}
                  ></Note>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      )}

      {loginInfo && notes && notesLayout === 1 && (
        <Masonry
          gutter="1rem"
          columnsCount={1}
          className="masonry-list__container"
        >
          {notes.filter(handleSearchFilter).map((note) => {
            return (
              <div key={`${note.id} ${note.modified}`}>
                <Note
                  isCollapsed={isCollapsed}
                  note={note}
                  // si el id de la nota está en el array de ids que tienen overflow, entonces pone los puntitos
                  noteOverflow={
                    notesOver.some((e) => e === note.id) ? "..." : ""
                  }
                  isNewNote={false}
                ></Note>
              </div>
            );
          })}
        </Masonry>
      )}
      {loginInfo && !notes && <p> Cargando...</p>}
    </div>
  );
}
