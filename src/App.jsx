import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const API_URL = "https://todoapp-exp1-production.up.railway.app";
//const API_URL = "http://localhost:3025";

function App() {
  const [notesData, setNotesData] = useState();
  const [newNote, setNewNote] = useState("");

  //FIXME: ojo que los datos vienen ordenados por PK (id)
  // habría que reordenar o modificar la consulta
  async function cargarDatos() {
    let data = await fetch(API_URL)
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
      });

    setNotesData(data);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function handleBorrar(event) {
    const deleteId = event.currentTarget.dataset.key;

    setNotesData((prev) => prev.filter((note) => note.id != deleteId));

    //? TODO: está bien así o debería ser con async en la f() y await fetch???
    fetch(`${API_URL}/del/${deleteId}`, {
      method: "DELETE",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // TODO: ?? con o sin a/a?
  async function handleGuardar() {
    let nuevoId = uuidv4();
    setNotesData((prev) => {
      return [{ id: nuevoId, tarea: newNote }, ...prev];
    });

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ id: nuevoId, tarea: newNote }),
    })
      .then((res) => {
        return res; // para ver el statustext usar: console.log(res.text());
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <h1>N:</h1>

      {/* esto hay que ponerlo en un componente para que el rerender no afecte toda la página 
      sino solo al componente 
      https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
      */}
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          justifyContent: "center",
          margin: "1rem",
        }}
      >
        <input
          name="newNote"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          type="text"
        />
        <button onClick={handleGuardar}>Guardar</button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "0.4rem",
          justifyContent: "center",
          margin: "1rem",
        }}
      >
        {notesData &&
          notesData.map((note) => {
            return (
              <div
                key={note.id}
                style={{
                  border: "1px solid gray",
                  borderRadius: "5px",
                  padding: "0.4rem",
                }}
              >
                {note.id} {note.tarea}{" "}
                <button data-key={note.id} onClick={handleBorrar}>
                  borrar
                </button>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default App;
