import { Link } from "react-router-dom";

function Item({ producto }) {
  return (
    <article className="item">

      <img
        src={producto.imagen}
        alt={producto.nombre}
      />

      <div className="item-info">

        <h2>{producto.nombre}</h2>

        <p className="categoria">
          Categoría: {producto.categoria}
        </p>

        <p>
          {producto.descripcion}
        </p>

        <p className="precio">
          ${producto.precio}
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