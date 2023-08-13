import { useState, useEffect } from "react";
import { createContext, useReducer } from "react";
import { PropTypes } from "prop-types";
import { dbGetNotes } from "./dbHandler";

export const NotesContext = createContext(null);
export const NotesDispatchContext = createContext(null);

export const NotesFilterContext = createContext(null);
export const SetNotesFilterContext = createContext(null);

export const NotesLayoutContext = createContext(null);
export const SetNotesLayoutContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, null);
  const [notesFilter, setNotesFilter] = useState({ text: "", tags: "" });

  const [notesLayout, SetNotesLayout] = useState(
    JSON.parse(localStorage.getItem("notesLayout")) || 0
  );
  useEffect(() => {
    localStorage.setItem("notesLayout", notesLayout);
  }, [notesLayout]);

  // el ignore es para ignorar posibles respuestas pendientes
  // que lleguen después
  // como está explicado acá (último ejemplo de data fetching) https://react.dev/learn/you-might-not-need-an-effect
  useEffect(() => {
    async function getData(ignore) {
      let data = await dbGetNotes();
      if (!ignore) {
        dispatch({ type: "get", notes: data });
      }
    }
    let ignore = false;
    getData(ignore);
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        <NotesFilterContext.Provider value={notesFilter}>
          <SetNotesFilterContext.Provider value={setNotesFilter}>
            <NotesLayoutContext.Provider value={notesLayout}>
              <SetNotesLayoutContext.Provider value={SetNotesLayout}>
                {children}
              </SetNotesLayoutContext.Provider>
            </NotesLayoutContext.Provider>
          </SetNotesFilterContext.Provider>
        </NotesFilterContext.Provider>
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

NotesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

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
