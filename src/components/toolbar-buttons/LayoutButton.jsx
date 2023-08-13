import "../../App.css";
import { NotesLayoutContext, SetNotesLayoutContext } from "../../NotesContext";
import { useContext } from "react";
import { ReactComponent as LayoutMasonryIcon } from "../../assets/LayoutMasonryIcon.svg";
import { ReactComponent as LayoutListIcon } from "../../assets/LayoutListIcon.svg";
import { Tooltip } from "antd";

export default function LayoutButton() {
  const SetNotesLayout = useContext(SetNotesLayoutContext);
  const notesLayout = useContext(NotesLayoutContext);

  return (
    <div>
      {notesLayout === 0 && (
        <Tooltip placement="topLeft" title="vista Lista">
          <LayoutListIcon
            onClick={() => SetNotesLayout((prev) => (prev === 0 ? 1 : 0))}
            className="toolbar__icon"
          ></LayoutListIcon>
        </Tooltip>
      )}

      {notesLayout === 1 && (
        <Tooltip placement="topLeft" title="vista Mosaico">
          <LayoutMasonryIcon
            onClick={() => SetNotesLayout((prev) => (prev === 0 ? 1 : 0))}
            className="toolbar__icon"
          ></LayoutMasonryIcon>
        </Tooltip>
      )}
    </div>
  );
}
