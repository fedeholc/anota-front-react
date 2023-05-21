import { useNotes } from "../NotesContext.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Note } from "./note/Note.jsx";
import { FloatButton, ConfigProvider } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function NewNoteFloatButton() {
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
    <div>
      {showNewNote && (
        <Note
          note={newNote}
          isNewNote={true}
          setShowNewNote={setShowNewNote}
          noteOverflow={null}
        ></Note>
      )}

      <div
        style={{
          position: "fixed",
          right: "40px",
          bottom: "40px",
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              FloatButton: {
                colorPrimaryHover: "rgb(10,10,10)",
                colorPrimary: "gray",
                colorTextLightSolid: "white",
              },
            },
          }}
        >
          <FloatButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowNewNote(true);
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
