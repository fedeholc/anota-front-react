import NewNoteModal from "./NewNoteModal";
import { useNotesDispatch, useNotes } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";
import { getFormattedDateTime } from "./utilityFunctions.jsx";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { dbAddNote } from "./dbHandler.jsx";
import { Note } from "./components/note/Note";

export default function NotesInput() {
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState({
    id: uuidv4(),
    noteText: "",
    noteHTML: "",
    noteTitle: "",
    tags: "",
    category: "",
    deleted: false,
    archived: false,
    reminder: "",
    rating: 0,
    created: "",
    modified: "",
  });

  const dispatch = useNotesDispatch();
  const notes = useNotes();

  useEffect(() => {
    setNewNote({
      id: uuidv4(),
      noteText: "",
      noteHTML: "",
      noteTitle: "",
      tags: "",
      category: "",
      deleted: false,
      archived: false,
      reminder: "",
      rating: 0,
      created: "",
      modified: "",
    });
  }, [notes]);

  return (
    <>
      {/*  {showModal ? <NewNoteModal setShowModal={setShowModal} /> : null} */}
      {!showModal && (
        <div>
          <div className="new-note__container">
            <input
              name="noteTitle"
              placeholder="Nueva nota..."
              type="text"
              className="new-note__title"
              onFocus={() => {
                setShowModal(true);
              }}
            />
          </div>
        </div>
      )}
      {showModal && (
        <Note
          note={newNote}
          newNote={true}
          setShowModal={setShowModal}
          noteOverflow={null}
        ></Note>
      )}
    </>
  );
}
