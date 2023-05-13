import "./App.css";
import { NotesProvider } from "./NotesContext";
import NotesList from "./NotesList";
import NotesInput from "./NoteInput";

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
