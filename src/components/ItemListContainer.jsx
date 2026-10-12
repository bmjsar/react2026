
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Item from "./Item";

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

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

  if (productos.length === 0) {
    return <p className="mensaje">No hay productos cargados.</p>;
  }

  return (
    <section className="productos-container">
      <h2>Nuestros productos</h2>

      <div className="productos-grid">
        {productos.map((producto) => (
          <Item key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}

export default ItemListContainer;
