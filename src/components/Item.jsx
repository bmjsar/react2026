
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Item({ producto }) {
  const { carrito } = useCart();

  const productoEnCarrito = carrito.find(
    (item) => item.id === producto.id
  );

  const cantidadEnCarrito = productoEnCarrito
    ? productoEnCarrito.cantidad
    : 0;

  const stockDisponible = Math.max(
    0,
    producto.stock - cantidadEnCarrito
  );

  // Si la imagen es una URL externa, la usamos directamente.
  // Si es local, la buscamos dentro de public.
  const rutaImagen = producto.imagen?.startsWith("http")
    ? producto.imagen
    : `${import.meta.env.BASE_URL}${producto.imagen?.replace(/^\/+/, "")}`;

  return (
    <article className="item">
      <img
        src={rutaImagen}
        alt={producto.nombre}
        onError={(e) => {
          console.error(
            "No se pudo cargar la imagen:",
            rutaImagen
          );
        }}
      />

      <div className="item-info">
        <h2>{producto.nombre}</h2>

        <p className="categoria">
          Categoría: {producto.categoria}
        </p>

        <p>{producto.descripcion}</p>

        <p className="precio">
          ${producto.precio}
        </p>

        <p className="stock">
          {stockDisponible > 0
            ? `Stock disponible: ${stockDisponible} unidades`
            : "Producto sin stock"}
        </p>

        <Link
          className="boton"
          to={`/producto/${producto.id}`}
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default Item;
