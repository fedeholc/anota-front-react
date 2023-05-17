import { useState } from "react";
import NewNoteModal from "./NewNoteModal";

export default function NewNoteFloatButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {showModal ? <NewNoteModal setShowModal={setShowModal} /> : null}
      <div
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          backgroundColor: "red",
          height: "50px",
          width: "50px",
          borderRadius: "50%",
          display: "grid",
          justifyContent: "center",
        }}
      >
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          onClick={() => {
            setShowModal(true);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
