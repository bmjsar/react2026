
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";

const COLECCION = "productos nacionales";

function ProductoNacionalDetalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [agregando, setAgregando] = useState(false);
  useEffect(() => {
    async function obtenerProducto() {
      setCargando(true);
      setProducto(null);
      setError("");

      try {
        // Referencia al documento cuyo ID viene en la URL.
        const referencia = doc(db, COLECCION, id);

        // Consulta de un único documento en Firestore.
        const respuesta = await getDoc(referencia);

        if (respuesta.exists()) {
          setProducto({
            id: respuesta.id,
            ...respuesta.data(),
          });
        } else {
          setError("No se encontró el producto solicitado.");
        }
      } catch (error) {
        console.error("Error al consultar el producto:", error);
        setError("No se pudo cargar el producto. Revisá la conexión.");
      } finally {
        setCargando(false);
      }
    }

    obtenerProducto();
  }, [id]);

  if (cargando) {
    return (
      <section className="producto-detalle">
        <p className="mensaje">Cargando producto...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="producto-detalle">
        <p className="mensaje" role="alert">{error}</p>

        <Link className="boton" to="/productos">
          Volver a productos
        </Link>
      </section>
    );
  }

  const rutaImagen = producto.imagen?.startsWith("http")
    ? producto.imagen
    : producto.imagen
      ? `${import.meta.env.BASE_URL}${producto.imagen.replace(/^\/+/, "")}`
      : "";

  return (
    <section className="producto-detalle">
      <h1>{producto.nombre}</h1>


      {rutaImagen && (
        <img
          src={rutaImagen}
          alt={producto.nombre}
          onError={() =>
            console.error("No se pudo cargar la imagen:", rutaImagen)
          }
        />
      )}

      <p className="categoria">
        Categoría: {producto.categoria || "Sin categoría"}
      </p>

      <p>{producto.descripcion}</p>

      <p className="precio">
        Precio: ${producto.precio}
      </p>

      <p className="stock">
        Stock: {producto.stock ?? 0} unidades
      </p>

      <button
  className="boton"
  type="button"
  disabled={agregando || Number(producto.stock ?? 0) <= 0}
  onClick={async () => {
    setAgregando(true);
    try {
      const agregado = await agregarAlCarrito(producto);

      if (agregado) {
        const referencia = doc(db, COLECCION, id);
        const respuesta = await getDoc(referencia);

        if (respuesta.exists()) {
          setProducto({
            id: respuesta.id,
            ...respuesta.data(),
          });
        }
      }
    } finally {
      setAgregando(false);
    }
  }}
>
  {agregando
    ? "Agregando..."
    : Number(producto.stock ?? 0) > 0
      ? "Agregar al carrito"
      : "Sin stock"}
  </button>

      <Link className="boton" to="/productos">
        Volver a productos
      </Link>
    </section>
  );
}

export default ProductoNacionalDetalle;
