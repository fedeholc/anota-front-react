import { useContext } from "react";
import { LoginContext } from "../../context";
import { supabase } from "../../supabaseClient";
import login from "./login.module.css";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export function LoginAuth() {
  /*   async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error al hacer SignOut");
  } */
  const loginInfo = useContext(LoginContext);
  return (
    <div>
      {/* <div className={login.auth__info}>
        {loginInfo ? loginInfo.user.email : ""}
        {loginInfo && (
          <button className={login.btnSignOut} onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </div> */}
      {!loginInfo && (
        <div className={login.auth__wrapper}>
          <div className={login.auth__container}>
            <div className={login.auth_msg}>
              Por favor ingrese su email y contraseña, o regístrese si aún no lo
              hizo.
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
    </div>
  );
}
