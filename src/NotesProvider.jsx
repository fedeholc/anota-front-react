import { useState, useEffect } from "react";
import { useReducer } from "react";
import { PropTypes } from "prop-types";
import { dbGetNotes } from "./dbHandler";
import { supabase } from "./supabaseClient";

import {
  NotesContext,
  NotesFilterContext,
  SetNotesFilterContext,
  NotesLayoutContext,
  SetNotesLayoutContext,
  LoginContext,
  SetLoginContext,
  supabaseClientContext,
} from "./context"; 

 

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, null);
  const [notesFilter, setNotesFilter] = useState({ text: "", tags: "" });

  const [notesLayout, setNotesLayout] = useState(
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

  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    console.log(supabase);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <NotesContext.Provider value={{ notes, dispatch }}>
      <NotesFilterContext.Provider value={notesFilter}>
        <SetNotesFilterContext.Provider value={setNotesFilter}>
          <NotesLayoutContext.Provider value={notesLayout}>
            <SetNotesLayoutContext.Provider value={setNotesLayout}>
              <LoginContext.Provider value={session}>
                <SetLoginContext.Provider value={setSession}>
                  <supabaseClientContext.Provider value={supabase}>
                    {children}
                  </supabaseClientContext.Provider>
                </SetLoginContext.Provider>
              </LoginContext.Provider>
            </SetNotesLayoutContext.Provider>
          </NotesLayoutContext.Provider>
        </SetNotesFilterContext.Provider>
      </NotesFilterContext.Provider>
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
      let updatedNotes = notes.map((note) => {
        if (note.id == action.note.id) {
          return action.note;
        } else {
          return note;
        }
      });
      return [...updatedNotes];
    }
    case "deleted": {
      return notes.filter((note) => note.id !== action.deleteId);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
