import "./App.css";
import { NotesProvider } from "./NotesContext";
import NotesListMasonry from "./NotesListMasonry";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import NewNoteButton from "./components/NewNoteButton";
import SearchByTag from "./components/SearchByTag";
import { Divider } from "antd";
import LayoutButton from "./components/LayoutButton";
import { useState } from "react";
import CollapseButton from "./components/CollapseButton";
function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function handleCollapsed() {
    setIsCollapsed((prev) => !prev);
  }
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
                <div className="top-toolbar__search">
                  <SearchBar></SearchBar>
                  <SearchByTag></SearchByTag>
                </div>
                <div className="top-toolbar__new">
                  <Divider type="vertical" />
                  <CollapseButton
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                  ></CollapseButton>
                  <LayoutButton></LayoutButton>
                  <NewNoteButton></NewNoteButton>
                </div>
              </div>
              <NotesListMasonry isCollapsed={isCollapsed}></NotesListMasonry>
            </NotesProvider>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}

export default App;
