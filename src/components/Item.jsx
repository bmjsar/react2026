
import { Link } from "react-router-dom";


function Item({ producto }) {
  

  const stockDisponible = Number(producto.stock || 0);

  // Si la imagen es externa, usamos su URL directamente.
  // Si es local, buscamos la imagen dentro de public.
  const rutaImagen = producto.imagen?.startsWith("http")
    ? producto.imagen
    : `${import.meta.env.BASE_URL}${producto.imagen?.replace(/^\/+/, "")}`;

  return (
    <article className="item">
      <img
        src={rutaImagen}
        alt={producto.nombre}
        onError={() => {
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
          to={`/productos-nacionales/${producto.id}`}
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default Item;

