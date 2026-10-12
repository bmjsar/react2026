
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";

function ProductoDetalle() {
  const { id } = useParams();

  const {
    carrito,
    mensaje,
    agregarAlCarrito,
  } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarProducto() {
      setCargando(true);
      setError(false);
      setProducto(null);

      try {
        const consulta = await getDocs(
          collection(db, "productos nacionales")
        );

        const productos = consulta.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        const encontrado = productos.find(
          (item) => item.id === id
        );

        if (activo) {
          setProducto(encontrado ?? null);
        }
      } catch (error) {
        console.error(
          "Error al cargar el producto desde Firestore:",
          error
        );

        if (activo) {
          setError(true);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarProducto();

    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return <p className="mensaje">Cargando producto...</p>;
  }

  if (error) {
    return (
      <section className="detalle">
        <h2>Error al cargar el producto.</h2>
        <p>Verificá tu conexión y la configuración de Firebase.</p>

        <Link className="boton" to="/productos">
          Volver a productos
        </Link>
      </section>
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

  const productoEnCarrito = carrito.find(
    (item) => item.id === producto.id
  );

  const cantidadEnCarrito = productoEnCarrito
    ? productoEnCarrito.cantidad
    : 0;

  const stockDisponible = Math.max(
    0,
    Number(producto.stock || 0) - cantidadEnCarrito
  );

  const sinStock = stockDisponible === 0;

  return (
    <section className="detalle">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        onError={(evento) => {
          console.error(
            "No se pudo cargar la imagen:",
            producto.imagen
          );
          evento.currentTarget.style.display = "none";
        }}
      />

      <div>
        <h1>{producto.nombre}</h1>

        <p>Categoría: {producto.categoria}</p>

        <p>{producto.descripcion}</p>

        <h2>${producto.precio}</h2>

        <p className="stock">
          {sinStock
            ? "Producto sin stock disponible"
            : `Stock disponible: ${stockDisponible} unidades`}
        </p>

        <button
          className="boton"
          disabled={sinStock}
          onClick={() => agregarAlCarrito(producto)}
        >
          {sinStock ? "Sin stock" : "Agregar al carrito"}
        </button>

        {mensaje && (
          <p className="mensaje-stock" role="status">
            {mensaje}
          </p>
        )}

        <p>
          <Link className="volver" to="/productos">
            ← Volver a productos
          </Link>
        </p>
      </div>
    </section>
  );
}

export default ProductoDetalle;


