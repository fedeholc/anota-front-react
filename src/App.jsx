import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

//const API_URL = "https://todoapp-exp1-production.up.railway.app";
const API_URL = "http://localhost:3025";

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

  // ?? con o sin a/a?
  async function handleGuardar() {
    let nuevoId = uuidv4();
    let resultado = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ id: nuevoId, tarea: newNote }),
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("resultado: ", resultado); // para ver el statustext usar: await resultado.text());
    console.log("nuevoid:", nuevoId);
    setNotesData((prev) => {
      return [{ id: nuevoId, tarea: newNote }, ...prev];
    });

    //?? TODO: guardamos la nota con el nuevo id? definir
    //?? el problema es que tarda si esperamos a tener el id
    //?? para mostrar la nota guardada tarda un poco
    // habría que ver cómo hacer para mostrar la nota y después actualizar el id
    // creo que si uso el generador de ids ya de ese modo yo podría tener mi clave primaria
  }

  return (
    <>
      <h1>N:</h1>

      {/* esto hay que ponerlo en un componente para que el rerender no afecte toda la página 
      sino solo al componente 
      https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
      */}
      <input
        name="newNote"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        type="text"
      />
      <button onClick={handleGuardar}>Guardar</button>

      <div style={{ display: "grid", gap: "1rem", justifyContent: "center" }}>
        {notesData &&
          notesData.map((note) => {
            return (
              <div key={note.id}>
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
