import { useNotes } from "../NotesContext.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Note } from "./note/Note.jsx";
import { FloatButton, ConfigProvider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./NewNoteButton.css";

export default function NewNoteButton() {
  const [showNewNote, setShowNewNote] = useState(false);
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
    <div className="toolbar__button-container">
      {showNewNote && (
        <Note
          note={newNote}
          isNewNote={true}
          setShowNewNote={setShowNewNote}
          noteOverflow={null}
        ></Note>
      )}

      {/* //! TODO: tal vez en lugar de texto ponerle tooltip
      //ver cual es el modo correcto para hacerlo con accesibilidad */}
      <button className="toolbar__button"
        onClick={() => {
          setShowNewNote(true);
        }}
      >
        Nueva
      </button>

      <PlusOutlined className="toolbar__icon" />
    </div>
  );
}
