import { useState } from "react";
import NewNoteModal from "./NewNoteModal";

export default function NotesInput() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal ? <NewNoteModal setShowModal={setShowModal} /> : null}
      {!showModal && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            margin: "1rem",
            maxWidth: "500px",
          }}
        >
          <div className="note_input_container">
            <input
              name="noteTitle"
              placeholder="¿Título...?"
              type="text"
              className="note_editable note_editable_title"
              onFocus={() => {
                setShowModal(true);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
