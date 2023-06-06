import "./App.css";
import { NotesProvider } from "./NotesContext";
import NotesListMasonry from "./components/note/NotesListMasonry";
import Footer from "./components/footer/Footer";
import SearchByText from "./components/search/SearchByText";
import NewNoteButton from "./components/toolbar-buttons/NewNoteButton";
import SearchByTag from "./components/search/SearchByTag";
import { Divider } from "antd";
import LayoutButton from "./components/toolbar-buttons/LayoutButton";
import { useState } from "react";
import CollapseButton from "./components/toolbar-buttons/CollapseButton";
import { useEffect } from "react";
function App() {
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("isCollapsed") || false)
  );

  useEffect(() => {
    localStorage.setItem("isCollapsed", isCollapsed);
  }, [isCollapsed]);

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
                  <SearchByText></SearchByText>
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
