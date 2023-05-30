import "./App.css";
import { NotesProvider } from "./NotesContext";
import NotesListMasonry from "./NotesListMasonry";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import NewNoteButton from "./components/NewNoteButton";
import { Divider } from "antd";
import SearchByTag from "./components/SearchByTag";

function App() {
  return (
    <>
      <div className="app__body">
        <div className="sticky-navbar">ANOTA (Another Note Taking App)</div>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr",
          }}
        >
          <div>
            <NotesProvider>
              <div className="top-toolbar">
                <SearchBar></SearchBar>
                <Divider type="vertical" />
                <SearchByTag></SearchByTag>
                <Divider type="vertical" />

                <NewNoteButton></NewNoteButton>
              </div>

              <NotesListMasonry></NotesListMasonry>
            </NotesProvider>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}

export default App;
