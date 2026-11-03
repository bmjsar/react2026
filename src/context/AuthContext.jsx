
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cancelarObservacion = onAuthStateChanged(
      auth,
      async (usuarioFirebase) => {
        if (usuarioFirebase) {
          try {
            const referencia = doc(db, "usuarios", usuarioFirebase.uid);
            const documento = await getDoc(referencia);

            setUsuario(usuarioFirebase);
            setRol(
              documento.exists()
                ? documento.data().rol
                : "cliente"
            );
          } catch (error) {
            console.error("Error al obtener el rol:", error);
            setUsuario(usuarioFirebase);
            setRol("cliente");
          }
        } else {
          setUsuario(null);
          setRol(null);
        }

        setCargando(false);
      }
    );

    return () => cancelarObservacion();
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        cargando,
        cerrarSesion,
        autenticado: !!usuario,
        esAdmin: rol === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
