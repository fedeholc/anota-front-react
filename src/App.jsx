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

import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabase = createClient(
  "https://xbnjcziobgswkczsvssv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibmpjemlvYmdzd2tjenN2c3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyNDc1MzAsImV4cCI6MjAwODgyMzUzMH0.FEYcuWPO4B4kDmOMbmXqy_K6TsW8xoRAF9CQCo0SRUU"
);

function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error al hacer SignOut");
  }

  const [session, setSession] = useState(null);

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
            <div className="auth__info">
              <div>{session ? session.user.email : ""}</div>
              {session && (
                <button className="btnSignOut" onClick={handleSignOut}>
                  Sign Out
                </button>
              )}
            </div>
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

            {!session && (
              <div className="auth__wrapper">
                <div className="auth__container">
                  <div className="auth_msg">
                    Por favor ingrese su email y contraseña, o regístrese si aún
                    no lo hizo.
                  </div>
                  <div className="supa_auth">
                    <Auth
                      supabaseClient={supabase}
                      appearance={{ theme: ThemeSupa }}
                      providers={["google", "github"]}
                    />
                  </div>
                </div>
              </div>
            )}
            <div>
              <NotesListMasonry isCollapsed={isCollapsed}></NotesListMasonry>
            </div>
          </div>
          <Footer></Footer>
        </div>
      </NotesProvider>
    </>
  );
}

export default App;
