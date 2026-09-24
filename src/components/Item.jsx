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

        <a
          className="boton"
          href={`/producto/${producto.id}`}
        >
          Ver detalle
        </a>

      </div>

    </article>
  );
}

export default Item;