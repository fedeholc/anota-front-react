/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import { createContext, useContext, useReducer } from "react";
import { PropTypes } from "prop-types";
import { dbGetNotes } from "./dbHandler";

const NotesContext = createContext(null);
const NotesDispatchContext = createContext(null);

//prueba para usar sin el hook
export const NotesFilterContext = createContext(null);
export const SetNotesFilterContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, null);
  const [notesFilter, setNotesFilter] = useState({ text: "", tags: "" });

  async function getData() {
    dispatch({ type: "get", notes: await dbGetNotes() });
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        <NotesFilterContext.Provider value={notesFilter}>
          <SetNotesFilterContext.Provider value={setNotesFilter}>
            {children}
          </SetNotesFilterContext.Provider>
        </NotesFilterContext.Provider>
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
    /*   case "flush": {
      return action.notes;
    } */

    //problema: si se filtran las notas y luego se vuelve a escribir otra busqueda se vuelve a filtrar sobre lo filtrado
    //solucion: hacer que el filtro se haga sobre las notas originales
    // para lo cual debería tener otro array de notas.
    case "search": {
      return notes.filter((note) => note.noteTitle.includes(action.searchText));
    }
    case "get": {
      return action.notes;
    }
    case "added": {
      return [action.note, ...notes];
    }

    case "updated": {
      return notes.map((note) => {
        if (note.id == action.note.id) {
          return action.note;
        } else {
          return note;
        }
      });
    }
    case "deleted": {
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
