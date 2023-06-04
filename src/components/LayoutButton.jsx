import { ProfileOutlined, ProjectOutlined } from "@ant-design/icons";
import "./NewNoteButton.css";
import { NotesLayoutContext, SetNotesLayoutContext } from "../NotesContext";

import { useContext } from "react";

export default function LayoutButton() {
  const SetNotesLayout = useContext(SetNotesLayoutContext);
  const notesLayout = useContext(NotesLayoutContext);

  return (
    <div>
      {notesLayout === 0 && (
        <ProfileOutlined
          onClick={() => SetNotesLayout((prev) => (prev === 0 ? 1 : 0))}
          className="toolbar__icon"
        ></ProfileOutlined>
      )}

      {notesLayout === 1 && (
        <ProjectOutlined
          onClick={() => SetNotesLayout((prev) => (prev === 0 ? 1 : 0))}
          className="toolbar__icon"
        ></ProjectOutlined>
      )}
    </div>
  );
}
