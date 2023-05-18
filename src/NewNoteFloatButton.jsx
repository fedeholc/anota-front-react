import { useState } from "react";
import NewNoteModal from "./NewNoteModal";

import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";

export default function NewNoteFloatButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {showModal ? <NewNoteModal setShowModal={setShowModal} /> : null}
      <div
        style={{
          position: "fixed",
          right: "40px",
          bottom: "40px",
        }}
      >
        <Fab
          onClick={() => {
            setShowModal(true);
          }}
          size="medium"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
}
