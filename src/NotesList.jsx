//import { useState } from "react";
import { useNotes, useNotesDispatch } from "./NotesContext.jsx";
import ContentEditable from "react-contenteditable";

export default function NotesList() {
  const notes = useNotes();
  const dispatch = useNotesDispatch();

  function handleBorrar(event) {
    const deleteId = event.currentTarget.dataset.key;
    dispatch({ type: "deleted", deleteId: deleteId });
  }

  function handleEditableChange(event) {
    console.log(event);
  }

  function handleGuardarEditable(event) {
    dispatch({
      type: "updated",
      updateId: event.target.dataset.key,
      contenidoNuevoHTML: event.target.innerHTML,
      contenidoNuevoText: event.target.innerText,
    });
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "0.4rem",
        justifyContent: "center",
        margin: "1rem",
      }}
    >
      {notes &&
        notes.map((note, index) => {
          /* return (
            <li key={note.id}>
              <p>{note.noteText}</p>
            </li>
          ); */
          return (
            <div
              key={note.id}
              style={{
                border: "1px solid gray",
                borderRadius: "5px",
                padding: "0.4rem",
              }}
            >
              <div>{note.id}</div>
              <div>Nota: </div>
              <ContentEditable
                html={`${notes[index].noteHTML}`} // innerHTML of the editable div
                disabled={false} // use true to disable edition
                onChange={handleEditableChange} // handle innerHTML change
                data-key={note.id}
                onBlur={handleGuardarEditable} //TODO: hacer que guarde
              />
              <button data-key={note.id} onClick={handleBorrar}>
                borrar
              </button>
            </div>
          );
        })}
    </div>
  );
}

/* function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            dispatch({
              type: "changed",
              task: {
                ...task,
                text: e.target.value,
              },
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          dispatch({
            type: "changed",
            task: {
              ...task,
              done: e.target.checked,
            },
          });
        }}
      />
      {taskContent}
      <button
        onClick={() => {
          dispatch({
            type: "deleted",
            id: task.id,
          });
        }}
      >
        Delete
      </button>
    </label>
  );
} */
