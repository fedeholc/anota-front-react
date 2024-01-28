import { useNotes } from "../../useNotes.jsx";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useOnlineStatus } from "../../useOnlineStatus.jsx";
import { getFormattedDateTime } from "../../utilityFunctions.jsx";
import { dbAddNote } from "../../dbHandler.jsx";
import "../../App.css";
import { Note } from "../note/Note.jsx";

export default function NewNoteTest() {
  const [newNote, setNewNote] = useState();
  const [showNewNote, setShowNewNote] = useState(false);
  const { dispatch } = useNotes();
  const isOnline = useOnlineStatus();

  function handleNewNote() {
    let note = {
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
      created: getFormattedDateTime(),
      modified: getFormattedDateTime(),
    };
    setNewNote(note);
    dispatch({
      type: "added",
      note: note,
    });
    dbAddNote(note);
    setShowNewNote(true);
  }

  return (
    <div className="toolbar__button-container">
      {showNewNote && newNote && (
        <Note
          note={newNote}
          isNewNote={true}
          setShowNewNote={setShowNewNote}
          noteOverflow={""}
          isCollapsed={false}
        ></Note>
      )}

      {isOnline && (
        <Tooltip placement="topLeft" title="Nueva nota">
          <PlusOutlined onClick={handleNewNote} className="toolbar__icon" />
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
