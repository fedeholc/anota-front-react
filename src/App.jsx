import "./App.css";
import { NotesProvider } from "./NotesContext";
import NotesList from "./NotesList";
import NotesInput from "./NoteInput";
import NewNoteFloatButton from "./NewNoteFloatButton";

function App() {
  return (
    <>
      <h1>notes:</h1>
      <NotesProvider>
        <NotesInput></NotesInput>
        <NotesList></NotesList>
        <NewNoteFloatButton></NewNoteFloatButton>
      </NotesProvider>
    </>
  );
}

export default App;
