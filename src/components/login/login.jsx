import { useContext } from "react";
import { LoginContext } from "../../context";
import { supabase } from "../../supabaseClient";
import login from "./login.module.css";

export function Login() {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error al hacer SignOut");
  }
  const loginInfo = useContext(LoginContext);
  return (
    <div className={login.auth__info}>
      {loginInfo ? loginInfo.user.email : ""}
      {loginInfo && (
        <button className={login.btnSignOut} onClick={handleSignOut}>
          Sign Out
        </button>
      )}
    </div>
  );
}
