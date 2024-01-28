import { useNotes } from "../../useNotes.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Note } from "../note/Note.jsx";
import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useOnlineStatus } from "../../useOnlineStatus";

import "../../App.css";

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

  const { notes } = useNotes();
  const isOnline = useOnlineStatus();

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

      {isOnline && (
        <Tooltip placement="topLeft" title="Nueva nota">
          <PlusOutlined
            onClick={() => {
              setShowNewNote(true);
            }}
            className="toolbar__icon"
          />
        </Tooltip>
      )}
      {!isOnline && (
        <Tooltip placement="topLeft" title="Nueva nota (no disponible offline)">
          <div className="offline_warning">Offline. Intentando conectar...</div>
        </Tooltip>
      )}
    </div>
  );
}