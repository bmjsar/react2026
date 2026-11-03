
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, rolesPermitidos = [] }) {
  const { usuario, rol, cargando } = useAuth();
  const location = useLocation();

  // Esperar a que Firebase compruebe la sesión
  if (cargando) {
    return <p>Verificando sesión...</p>;
  }

  // Si no inició sesión, enviarlo al Login
  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Comprobar si tiene el rol autorizado
  if (
    rolesPermitidos.length > 0 &&
    !rolesPermitidos.includes(rol)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
