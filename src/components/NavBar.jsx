import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function NavBar() {
  const { cantidadTotal } = useCart();

  return (
    <nav className="navbar">
      <Link to="/">Inicio</Link>

      <Link to="/productos">Productos</Link>

      <Link to="/carrito">
        Carrito ({cantidadTotal})
      </Link>
    </nav>
  );
}

export default NavBar;