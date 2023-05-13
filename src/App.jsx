import "./App.css";
/* import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ContentEditable from "react-contenteditable"; */
import { NotesProvider } from "./NotesContext";
import NotesList from "./NotesList";
import NotesInput from "./NoteInput";

//const API_URL = "https://anotes1-production.up.railway.app";
const API_URL = "http://localhost:3025";

function App() {
  return (
    <>
      <h1>provider:</h1>
      <NotesProvider>
        <NotesInput></NotesInput>
        <NotesList></NotesList>
      </NotesProvider>
    </>
  );
}

export default App;
