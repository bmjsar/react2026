import { useEffect, useState } from "react";
import Item from "./Item";

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/productos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar productos.json");
        }

        return respuesta.json();
      })
      .then((datos) => {
        setProductos(datos);
        setCargando(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <p className="mensaje">
        Cargando productos...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mensaje">
        Ocurrió un error al cargar los productos.
      </p>
    );
  }

  return (
    <section className="productos-container">

      <h2>Nuestros productos</h2>

      <div className="productos-grid">

        {productos.map((producto) => (
          <Item
            key={producto.id}
            producto={producto}
          />
        ))}

      </div>

    </section>
  );
}

export default ItemListContainer;