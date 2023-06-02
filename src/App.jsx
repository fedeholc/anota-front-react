import "./App.css";
import { NotesProvider } from "./NotesContext";
import NotesListMasonry from "./NotesListMasonry";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import NewNoteButton from "./components/NewNoteButton";
import SearchByTag from "./components/SearchByTag";
import { Divider } from "antd";

function App() {
  return (
    <>
      <div className="app__container">
        <div className="app__sticky-navbar">
          ANOTA (Another Note Taking App)
        </div>
        <div className="app__main-grid">
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
