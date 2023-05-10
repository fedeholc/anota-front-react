import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ContentEditable from "react-contenteditable";

const API_URL = "https://anotes1-production.up.railway.app";
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
    console.log(data);
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
      return [{ id: nuevoId, note: newNote }, ...prev];
    });

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ id: nuevoId, note: newNote }),
    })
      .then((res) => {
        return res; // para ver el statustext usar: console.log(res.text());
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleEditable(event) {
    console.log(event);
  }

  function handleGuardarEditable(event) {
    //TODO: hacer que guarde!
    //el event target tiene el dataset.key con el id
    //y el innerhtml / innertxt
    //hay que modificar el array y guardar
    //ojo porque hay que tomar el html sino no guarda renglones
    //o sea tal vez tener siempre texto y html
    // para eso hay que sanitizar usando lo que usan
    //acá: https://codesandbox.io/s/l91xvkox9l?file=/src/index.js

    let updateId = event.target.dataset.key;

    setNotesData((prev) => {
      prev.map((e) => {
        if (e.id == updateId) {
          return { id: e.id, note: event.target.innerText };
        } else {
          return { id: e.id, note: e.note };
        }
      });
    });

    fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ id: updateId, note: event.target.innerText }),
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
          notesData.map((note, index) => {
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
                  html={`${notesData[index].note}`} // innerHTML of the editable div
                  disabled={false} // use true to disable edition
                  onChange={handleEditable} // handle innerHTML change
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
    </>
  );
}

export default App;
