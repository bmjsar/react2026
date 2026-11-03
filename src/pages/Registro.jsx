
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      // Crear usuario en Firebase Authentication
      const credenciales = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const usuario = credenciales.user;

      // Guardar los datos del usuario en Firestore
      await setDoc(doc(db, "usuarios", usuario.uid), {
        nombre: nombre,
        email: usuario.email,
        rol: "cliente",
        fechaRegistro: new Date()
      });

      navigate("/");
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("Este correo electrónico ya está registrado.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (error.code === "auth/invalid-email") {
        setError("El correo electrónico no es válido.");
      } else {
        setError("No se pudo completar el registro. Intentá nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="formulario-container">
      <h2>Crear una cuenta</h2>

      <form onSubmit={registrarUsuario}>
        <label>Nombre completo</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Registrarme"}
        </button>
      </form>

      <p>
        ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </section>
  );
}

export default Registro;
