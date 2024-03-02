import "../../App.css";
import { NotesLayoutContext, SetNotesLayoutContext } from "../../context";
import { useContext } from "react";
import LayoutMasonryIcon from "../../assets/LayoutMasonryIcon.svg?react";
import LayoutListIcon from "../../assets/LayoutListIcon.svg?react";
import { Tooltip } from "antd";

export default function LayoutButton() {
  const setNotesLayout = useContext(SetNotesLayoutContext);
  const notesLayout = useContext(NotesLayoutContext);

  function handleLayoutChange() {
    setNotesLayout((prev) => (prev === 0 ? 1 : 0));
  }

  return (
    <div>
      {notesLayout === 0 && (
        <Tooltip placement="topLeft" title="vista Lista">
          <div>
            <LayoutListIcon
              onClick={handleLayoutChange}
              className="toolbar__icon"
            ></LayoutListIcon>
          </div>
        </Tooltip>
      )}

      {notesLayout === 1 && (
        <Tooltip placement="topLeft" title="vista Mosaico">
          <div>
            <LayoutMasonryIcon
              onClick={() => setNotesLayout((prev) => (prev === 0 ? 1 : 0))}
              className="toolbar__icon"
            ></LayoutMasonryIcon>
          </div>
        </Tooltip>
      )}
    </div>
  );
}
