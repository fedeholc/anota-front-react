import { useState } from "react";
import NewNoteModal from "./NewNoteModal";

export default function NotesInput() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal ? <NewNoteModal setShowModal={setShowModal} /> : null}
      {!showModal && (
        <div>
          <div className="new-note__container">
            <input
              name="noteTitle"
              placeholder="¿Título...?"
              type="text"
              className="new-note__title"
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
