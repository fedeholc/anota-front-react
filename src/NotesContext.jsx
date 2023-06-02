/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { createContext, useContext, useReducer } from "react";
import { PropTypes } from "prop-types";
import { dbGetNotes } from "./dbHandler";

// estas no las exporto porque despues lo hago en un hook
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
  getData();

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
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
