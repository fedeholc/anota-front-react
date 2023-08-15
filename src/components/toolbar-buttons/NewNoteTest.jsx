import { useNotes } from "../../useNotes.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Note } from "../note/Note.jsx";
import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useOnlineStatus } from "../../useOnlineStatus.jsx";
import { getFormattedDateTime } from "../../utilityFunctions";
import { dbAddNote } from "../../dbHandler.jsx";
import "../../App.css";
import { Note2 } from "../note/Note2.jsx";

export default function NewNoteTest() {
  /*   const [showNewNote, setShowNewNote] = useState(false); */
  const [newNote, setNewNote] = useState({
    id: uuidv4(),
    noteText: "",
    noteHTML: "",
    noteTitle: "nn",
    tags: "",
    category: "",
    deleted: false,
    archived: false,
    reminder: "",
    rating: 0,
    created: getFormattedDateTime(),
    modified: getFormattedDateTime(),
  });
  const [showNewNote, setShowNewNote] = useState(false);

  const { notes, dispatch } = useNotes();
  const isOnline = useOnlineStatus();

  //este useEffect tiene que estar para que cambie el id con la creación de cada nota nueva
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
      created: getFormattedDateTime(),
      modified: getFormattedDateTime(),
    });
  }, [notes]);

  return (
    <div className="toolbar__button-container">
      {showNewNote && (
        <Note2
          note={newNote}
          isNewNote={true}
          setShowNewNote={setShowNewNote}
          noteOverflow={null}
        ></Note2>
      )}

      {isOnline && (
        <Tooltip placement="topLeft" title="Nueva nota">
          <PlusOutlined
            onClick={() => {
              dispatch({
                type: "added",
                note: newNote,
              });

              dbAddNote(newNote);
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
