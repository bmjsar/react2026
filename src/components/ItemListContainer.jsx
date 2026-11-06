
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

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const productosPorPagina = 6;

  const [searchParams] = useSearchParams();
  const categoriaSeleccionada = searchParams.get("categoria");

  useEffect(() => {
    async function obtenerProductos() {
      try {
        setCargando(true);
        setError(false);

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

  // Reiniciar la página al cambiar búsqueda o categoría.
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaSeleccionada]);

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

  // Normalizar texto para facilitar las búsquedas.
  function normalizarTexto(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Filtrar por categoría y por texto ingresado.
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = categoriaSeleccionada
      ? normalizarTexto(producto.categoria) ===
        normalizarTexto(categoriaSeleccionada)
      : true;

    const textoBusqueda = normalizarTexto(busqueda);

    const coincideBusqueda =
      normalizarTexto(producto.nombre).includes(textoBusqueda) ||
      normalizarTexto(producto.descripcion).includes(textoBusqueda);

    return coincideCategoria && coincideBusqueda;
  });

  // Calcular paginación.
  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );

  const paginaSegura = Math.min(
    paginaActual,
    Math.max(totalPaginas, 1)
  );

  const indiceInicial = (paginaSegura - 1) * productosPorPagina;
  const indiceFinal = indiceInicial + productosPorPagina;

  const productosPaginados = productosFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

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

      {/* Barra de búsqueda */}
      <div className="busqueda-productos">
        <label htmlFor="buscar-productos">
          Buscar productos
        </label>

        <input
          id="buscar-productos"
          type="search"
          placeholder="Escribí el nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <p className="cantidad-resultados">
        {productosFiltrados.length === 0
          ? "No se encontraron productos."
          : `${productosFiltrados.length} productos encontrados`}
      </p>

      {productosFiltrados.length === 0 ? (
        <p className="mensaje">
          No hay productos que coincidan con tu búsqueda o categoría.
        </p>
      ) : (
        <>
          {/* Productos de la página actual */}
          <div className="productos-grid">
            {productosPaginados.map((producto) => (
              <Item
                key={producto.id}
                producto={producto}
              />
            ))}
          </div>

          {/* Paginador */}
          {totalPaginas > 1 && (
            <nav
              className="paginacion-productos"
              aria-label="Paginación de productos"
            >
              <button
                type="button"
                onClick={() =>
                  setPaginaActual((actual) => actual - 1)
                }
                disabled={paginaSegura === 1}
              >
                Anterior
              </button>

              <span>
                Página {paginaSegura} de {totalPaginas}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPaginaActual((actual) => actual + 1)
                }
                disabled={paginaSegura === totalPaginas}
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}

export default ItemListContainer;



