/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import { createContext, useContext, useReducer } from "react";
import { PropTypes } from "prop-types";

import { v4 as uuidv4 } from "uuid";

//TODO: esto tiene que ir a un .ENV
const API_URL = "http://localhost:3025";

const NotesContext = createContext(null);

const NotesDispatchContext = createContext(null);

export function NotesProvider({ children }) {
  //le pongo algún valor inicial para que se vea algo o no de error hasta que cargue?
  const [notes, dispatch] = useReducer(notesReducer, null);

  const API_URL = "http://localhost:3025";

  //FIXME: ojo que los datos vienen ordenados por PK (id)
  // habría que reordenar o modificar la consulta
  async function cargarDatos() {
    let data = await fetch(API_URL)
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
      });
    console.log("data:", data);
    dispatch({ type: "get", notesData: data });
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

//TODO: ver documentacion de propTypes, y reactPropTypes
NotesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useNotes() {
  return useContext(NotesContext);
}

export function useNotesDispatch() {
  return useContext(NotesDispatchContext);
}

function notesReducer(notes, action) {
  switch (action.type) {
    case "get": {
      return action.notesData;
    }
    case "added": {
      let nuevoId = uuidv4();

      //con o sin async?
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //TODO:acá hay que pasar un objeto no cada campo indiv
        body: JSON.stringify({
          id: nuevoId,
          noteText: action.noteText,
          noteHTML: action.noteHTML,
        }),
      })
        .then((res) => {
          return res; // para ver el statustext usar: console.log(res.text());
        })
        .catch((error) => {
          console.error(error);
        });

      return [
        {
          id: nuevoId,
          noteText: action.noteText,
          noteHTML: action.noteHTML,
        },
        ...notes,
      ];
    }
    case "updated": {
      //el event target tiene el dataset.key con el id
      //y el innerhtml / innertxt
      //hay que modificar el array y guardar
      //ojo porque hay que tomar el html sino no guarda renglones
      //o sea tal vez tener siempre texto y html
      // para eso hay que sanitizar usando lo que usan
      //acá: https://codesandbox.io/s/l91xvkox9l?file=/src/index.js

      fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          id: action.updateId,
          noteText: action.contenidoNuevoText,
          noteHTML: action.contenidoNuevoHTML,
        }),
      })
        .then((res) => {
          return res; // para ver el statustext usar: console.log(res.text());
        })
        .catch((error) => {
          console.error(error);
        });

      return notes.map((e) => {
        if (e.id == action.updateId) {
          return {
            id: action.updateId,
            noteText: action.contenidoNuevoText,
            noteHTML: action.contenidoNuevoHTML,
          };
        } else {
          return { id: e.id, noteText: e.noteText, noteHTML: e.noteHTML };
        }
      });
    }
    case "deleted": {
      // TODO: separar de acá la parte de bd? poner async?
      fetch(`${API_URL}/del/${action.deleteId}`, {
        method: "DELETE",
      })
        .then((res) => {
          return res;
        })
        .catch((error) => {
          console.error(error);
        });

      return notes.filter((note) => note.id !== action.deleteId);
      /* asi? o (prev) => prev.filter((note) => note.id !== action.deleteId) 
      TODO: o no hace falta llamar al prev?? ver docu nueva react
      
      */
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
