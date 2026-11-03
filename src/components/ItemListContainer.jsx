
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useSearchParams, Link } from "react-router-dom";
import { db } from "../firebase";
import Item from "./Item";

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();

  const categoriaSeleccionada = searchParams.get("categoria");

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const referencia = collection(db, "productos nacionales");
        const respuesta = await getDocs(referencia);

        const productosObtenidos = respuesta.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        setProductos(productosObtenidos);
      } catch (error) {
        console.error("Error al obtener productos de Firestore:", error);
        setError(true);
      } finally {
        setCargando(false);
      }
    }

    obtenerProductos();
  }, []);

  async function eliminarProducto(id) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    );

    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "productos nacionales", id));

      setProductos((actuales) =>
        actuales.filter((producto) => producto.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  }

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(
        (producto) =>
          String(producto.categoria || "").trim().toLowerCase() ===
          categoriaSeleccionada.trim().toLowerCase()
      )
    : productos;

  if (cargando) {
    return <p className="mensaje">Cargando productos...</p>;
  }

  if (error) {
    return (
      <p className="mensaje">
        No se pudieron cargar los productos desde Firestore.
        Revisá la conexión y los permisos de la base de datos.
      </p>
    );
  }

  return (
    <section className="productos-container">
      <h2>
        {categoriaSeleccionada
          ? `Productos de ${categoriaSeleccionada}`
          : "Nuestros productos"}
      </h2>

      <div className="categorias-filtro">
        <Link to="/productos">Todos</Link>
        <Link to="/productos?categoria=Hogar">Hogar</Link>
        <Link to="/productos?categoria=Ropa">Ropa</Link>
        <Link to="/productos?categoria=Accesorios">Accesorios</Link>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="mensaje">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <div className="productos-grid">
          {productosFiltrados.map((producto) => (
            <Item key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ItemListContainer;


