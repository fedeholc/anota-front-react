import "./App.css";
import { NotesProvider } from "./NotesContext";
  import NotesList from "./NotesList";
  
import NotesInput from "./NoteInput";
import NotesListMasonry from "./NotesListMasonry";
import NewNoteFloatButton from "./components/NewNoteFloatButton";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <h1>notes:</h1>
      <NotesProvider>
        <NotesInput></NotesInput>
        <NotesListMasonry></NotesListMasonry>
         <NotesList></NotesList>  
        <NewNoteFloatButton></NewNoteFloatButton>
      </NotesProvider>
      <Footer></Footer>
    </>
  );
}

export default App;
