import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductoDetalle() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/productos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar productos.json");
        }

        return respuesta.json();
      })
      .then((datos) => {
        const productoEncontrado = datos.find(
          (producto) => producto.id === Number(id)
        );

        setProducto(productoEncontrado);
        setCargando(false);
      })
      .catch((error) => {
        console.error(error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return (
      <p className="mensaje">
        Cargando producto...
      </p>
    );
  }

  if (!producto) {
    return (
      <section className="detalle">
        <h2>Producto no encontrado</h2>

        <Link className="boton" to="/productos">
          Volver a productos
        </Link>
      </section>
    );
  }

  return (
    <section className="detalle">

      <img
        src={`${import.meta.env.BASE_URL}${producto.imagen}`}
        alt={producto.nombre}
/>

      <div>
        <h1>{producto.nombre}</h1>

        <p>
          Categoría: {producto.categoria}
        </p>

        <p>
          {producto.descripcion}
        </p>

        <h2>
          ${producto.precio}
        </h2>

        <button className="boton">
          Agregar al carrito
        </button>

        <br />

        <Link
          className="volver"
          to="/productos"
        >
          ← Volver a productos
        </Link>
      </div>

    </section>
  );
}

export default ProductoDetalle;