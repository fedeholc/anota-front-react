/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import { createContext, useContext, useReducer } from "react";
import { PropTypes } from "prop-types";
import { dbGetNotes } from "./dbHandler";

const NotesContext = createContext(null);
const NotesDispatchContext = createContext(null);
export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, null);

  async function getData() {
    dispatch({ type: "get", notes: await dbGetNotes() });
  }
  useEffect(() => {
    getData();
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
