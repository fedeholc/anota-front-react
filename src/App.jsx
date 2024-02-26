import "./App.css";
import { NotesProvider } from "./NotesProvider";
import NotesListMasonry from "./components/note/NotesListMasonry";
import Footer from "./components/footer/Footer";
import SearchByText from "./components/search/SearchByText";
import SearchByTag from "./components/search/SearchByTag";
import LayoutButton from "./components/toolbar-buttons/LayoutButton";
import { useState } from "react";
import CollapseButton from "./components/toolbar-buttons/CollapseButton";
import { useEffect } from "react";
import NewNoteTest from "./components/toolbar-buttons/NewNoteButton2";

import { Login } from "./components/login/login";
import { LoginAuth } from "./components/login/loginAuth";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("isCollapsed") || false)
  );

  useEffect(() => {
    localStorage.setItem("isCollapsed", isCollapsed);
  }, [isCollapsed]);

  return (
    <>
      <NotesProvider>
        <div className="app__container">
          <div className="app__main-grid">
            <Login></Login>
            <div className="top-toolbar-wrapper">
              <div className="top-nombre">📓ANOTA</div>

              <div className="top-toolbar">
                <div className="top-toolbar__search">
                  <SearchByText></SearchByText>
                  <SearchByTag></SearchByTag>
                </div>
                <div className="top-toolbar__new">
                  <CollapseButton
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                  ></CollapseButton>
                  <LayoutButton></LayoutButton>
                  <NewNoteTest></NewNoteTest>
                </div>
              </div>
            </div>

            <LoginAuth></LoginAuth>

            <NotesListMasonry isCollapsed={isCollapsed}></NotesListMasonry>
          </div>
          <Footer></Footer>
        </div>
      </NotesProvider>
    </>
  );
}

export default App;
