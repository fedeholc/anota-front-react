import "./App.css";
import { NotesProvider } from "./NotesContext";
import NotesList from "./NotesList";

import NotesInput from "./NoteInput";
import NotesListMasonry from "./NotesListMasonry";
import NewNoteFloatButton from "./components/NewNoteFloatButton";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import NewNoteButton from "./components/NewNoteButton";
import { Divider } from "antd";


function App() {
  return (
    <>
      <div className="app__body">
        <div className="sticky-navbar">ANOTA (Another Note Taking App)</div>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr",

            /*  border: "1px solid red", */
          }}
        >
          <div>
            <NotesProvider>
              <div className="top-toolbar">
                <SearchBar></SearchBar>
                <Divider type="vertical" />

                <NewNoteButton></NewNoteButton>
              </div>

              <NotesInput></NotesInput>
              <NotesListMasonry></NotesListMasonry>
              {/*          <NotesList></NotesList>
               */}
              <NewNoteFloatButton></NewNoteFloatButton>
            </NotesProvider>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}

export default App;
