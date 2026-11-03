
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import FormularioProducto from "./FormularioProducto";
import "./Panel.css";

const COLECCION = "productos nacionales";

function Panel() {
  const navigate = useNavigate();
  const { cerrarSesion } = useAuth();

  const [productos, setProductos] = useState([]);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  // Estados para los pedidos.
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState("");

  // Cerrar sesión.
  async function manejarCerrarSesion() {
    setCerrandoSesion(true);

    try {
      await cerrarSesion();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar la sesión. Intentá nuevamente.");
      setCerrandoSesion(false);
    }
  }

  // Cargar los productos desde Firestore.
  const cargarProductos = useCallback(async (mostrarCarga = false) => {
    if (mostrarCarga) {
      setCargando(true);
    }

    try {
      const referencia = collection(db, COLECCION);
      const respuesta = await getDocs(referencia);

      const lista = respuesta.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setProductos(lista);
      setError("");
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError("No se pudieron cargar los productos.");
    } finally {
      if (mostrarCarga) {
        setCargando(false);
      }
    }
  }, []);

  // Estadísticas de los pedidos.
  const totalPedidos = pedidos.length;

  const importeTotal = pedidos.reduce(
    (total, pedido) => total + Number(pedido.total ?? 0),
    0
  );

  const totalUnidades = pedidos.reduce(
    (total, pedido) => total + Number(pedido.cantidadTotal ?? 0),
    0
  );

  const pedidosRegistrados = pedidos.filter(
    (pedido) => pedido.usuarioUid
  ).length;

  const pedidosVisitantes = pedidos.filter(
    (pedido) => !pedido.usuarioUid
  ).length;

  // Cargar los pedidos desde Firestore.
  const cargarPedidos = useCallback(async () => {
    setCargandoPedidos(true);
    setErrorPedidos("");

    try {
      const referencia = collection(db, "pedidos");
      const respuesta = await getDocs(referencia);

      const lista = respuesta.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      // Ordenar del pedido más reciente al más antiguo.
      lista.sort((a, b) => {
        const fechaA = a.fecha?.toMillis?.() ?? 0;
        const fechaB = b.fecha?.toMillis?.() ?? 0;

        return fechaB - fechaA;
      });

      setPedidos(lista);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setErrorPedidos("No se pudieron cargar los pedidos.");
    } finally {
      setCargandoPedidos(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos(true);
    cargarPedidos();
  }, [cargarProductos, cargarPedidos]);

  // Crear un producto nuevo o actualizar uno existente.
  async function guardarProducto(datos) {
    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      if (productoEnEdicion) {
        const referencia = doc(
          db,
          COLECCION,
          productoEnEdicion.id
        );

        await updateDoc(referencia, datos);
        setMensaje("Producto actualizado correctamente.");
      } else {
        await addDoc(collection(db, COLECCION), datos);
        setMensaje("Producto creado correctamente.");
      }

      setProductoEnEdicion(null);
      await cargarProductos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setError("No se pudo guardar el producto. Intentá nuevamente.");
      throw error;
    } finally {
      setGuardando(false);
    }
  }

  // Preparar el formulario para editar.
  function editarProducto(producto) {
    setProductoEnEdicion(producto);
    setMensaje("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Cancelar la edición.
  function cancelarEdicion() {
    setProductoEnEdicion(null);
    setError("");
    setMensaje("");
  }

  // Eliminar un producto.
  async function eliminarProducto(producto) {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar "${producto.nombre}"?`
    );

    if (!confirmar) return;

    setError("");
    setMensaje("");

    try {
      await deleteDoc(doc(db, COLECCION, producto.id));

      setProductos((actuales) =>
        actuales.filter((item) => item.id !== producto.id)
      );

      if (productoEnEdicion?.id === producto.id) {
        setProductoEnEdicion(null);
      }

      setMensaje("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setError("No se pudo eliminar el producto.");
    }
  }

  // Formatear la fecha del pedido.
  function formatearFecha(fecha) {
    if (!fecha) return "Fecha no disponible";

    const fechaJavaScript = fecha.toDate
      ? fecha.toDate()
      : new Date(fecha);

    if (Number.isNaN(fechaJavaScript.getTime())) {
      return "Fecha no disponible";
    }

    return fechaJavaScript.toLocaleString("es-AR");
  }

  return (
    <main className="panel">

      {/* ENCABEZADO DEL PANEL */}
      <div className="panel-encabezado-principal">
        <div>
          <h1>Panel de administración</h1>
          <p className="panel-descripcion">
            Administrá los productos y consultá los pedidos de Faro Shop.
          </p>
        </div>

        <button
          type="button"
          className="panel-boton-cerrar-sesion"
          onClick={manejarCerrarSesion}
          disabled={cerrandoSesion}
        >
          {cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión"}
        </button>
      </div>

      {/* ESTADÍSTICAS */}
      <section className="panel-estadisticas">
        <h2>Resumen de ventas</h2>

        <div className="panel-estadisticas-grid">
          <article className="panel-estadistica">
            <h3>Pedidos registrados</h3>
            <p>{totalPedidos}</p>
          </article>

          <article className="panel-estadistica">
            <h3>Importe acumulado</h3>
            <p>${importeTotal.toLocaleString("es-AR")}</p>
          </article>

          <article className="panel-estadistica">
            <h3>Unidades solicitadas</h3>
            <p>{totalUnidades}</p>
          </article>

          <article className="panel-estadistica">
            <h3>Clientes registrados</h3>
            <p>{pedidosRegistrados}</p>
          </article>

          <article className="panel-estadistica">
            <h3>Pedidos de visitantes</h3>
            <p>{pedidosVisitantes}</p>
          </article>
        </div>
      </section>

      {error && (
        <p className="panel-error" role="alert">
          {error}
        </p>
      )}

      {mensaje && (
        <p className="panel-mensaje" role="status">
          {mensaje}
        </p>
      )}

      {/* SECCIÓN DE PRODUCTOS */}
      <FormularioProducto
        key={productoEnEdicion?.id ?? "nuevo"}
        productoInicial={productoEnEdicion}
        onGuardar={guardarProducto}
        onCancelar={cancelarEdicion}
        guardando={guardando}
      />

      <section className="panel-listado">
        <h2>Productos cargados</h2>

        {cargando ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos cargados.</p>
        ) : (
          <div className="panel-tabla-contenedor">
            <table className="panel-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria || "Sin categoría"}</td>
                    <td>
                      ${Number(producto.precio ?? 0).toLocaleString("es-AR")}
                    </td>
                    <td>{producto.stock ?? 0}</td>
                    <td className="panel-acciones">
                      <button
                        type="button"
                        onClick={() => editarProducto(producto)}
                        disabled={guardando}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="panel-boton-eliminar"
                        onClick={() => eliminarProducto(producto)}
                        disabled={guardando}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SECCIÓN DE PEDIDOS */}
      <section className="panel-listado panel-pedidos">
        <div className="panel-pedidos-encabezado">
          <h2>Pedidos recibidos</h2>

          <button
            type="button"
            onClick={cargarPedidos}
            disabled={cargandoPedidos}
          >
            {cargandoPedidos ? "Actualizando..." : "Actualizar pedidos"}
          </button>
        </div>

        {errorPedidos && (
          <p className="panel-error" role="alert">
            {errorPedidos}
          </p>
        )}

        {cargandoPedidos ? (
          <p>Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p>Todavía no hay pedidos registrados.</p>
        ) : (
          <div className="panel-pedidos-lista">
            {pedidos.map((pedido) => (
              <article className="panel-pedido" key={pedido.id}>
                <div className="panel-pedido-encabezado">
                  <h3>Pedido #{pedido.id}</h3>

                  <span className="panel-pedido-estado">
                    {pedido.estado || "Sin estado"}
                  </span>
                </div>

                <p>
                  <strong>Fecha:</strong>{" "}
                  {formatearFecha(pedido.fecha)}
                </p>

                <p>
                  <strong>Cliente:</strong>{" "}
                  {pedido.usuarioUid
                    ? `Usuario registrado (${pedido.usuarioUid})`
                    : "Visitante"}
                </p>

                <p>
                  <strong>Unidades:</strong>{" "}
                  {pedido.cantidadTotal ?? 0}
                </p>

                <h4>Productos del pedido</h4>

                {pedido.productos?.length > 0 ? (
                  <ul>
                    {pedido.productos.map((producto, indice) => (
                      <li key={`${producto.productoId}-${indice}`}>
                        {producto.nombre} — Cantidad: {producto.cantidad}
                        {" — "}Precio: $
                        {Number(producto.precio ?? 0).toLocaleString("es-AR")}
                        {" — "}Subtotal: $
                        {Number(producto.subtotal ?? 0).toLocaleString("es-AR")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay detalles de productos disponibles.</p>
                )}

                <h3 className="panel-pedido-total">
                  Total: $
                  {Number(pedido.total ?? 0).toLocaleString("es-AR")}
                </h3>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Panel;

