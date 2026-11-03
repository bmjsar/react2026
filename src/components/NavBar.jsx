
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { cantidadTotal } = useCart();
  const { esAdmin, cargando } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/">Inicio</Link>

      <Link to="/productos">Buscar productos</Link>

      <Link to="/productos?categoria=Hogar">Hogar</Link>

      <Link to="/productos?categoria=Ropa">Ropa</Link>

      <Link to="/productos?categoria=Accesorios">Accesorios</Link>

      <Link to="/carrito">
        Carrito ({cantidadTotal})
      </Link>

      {!cargando && esAdmin && (
        <Link to="/panel">Panel de administración</Link>
      )}
    </nav>
  );
}

export default NavBar;
