
import { useState } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useCart } from "../context/CartContext";

function Carrito() {
  const {
    carrito,
    mensaje,
    quitarDelCarrito,
    vaciarCarrito,
    cantidadTotal,
  } = useCart();

  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const total = carrito.reduce(
    (acumulado, producto) =>
      acumulado + Number(producto.precio) * producto.cantidad,
    0
  );

  const confirmarCompra = async () => {
    if (carrito.length === 0 || cargando) return;

    setCargando(true);
    setError("");

    try {
      // Preparamos una copia de los productos del carrito.
      const productosPedido = carrito.map((producto) => ({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        cantidad: producto.cantidad,
        subtotal: Number(producto.precio) * producto.cantidad,
      }));

      // Guardamos el pedido en Firestore.
      const documentoPedido = await addDoc(collection(db, "pedidos"), {
        productos: productosPedido,
        total: total,
        cantidadTotal: cantidadTotal,
        fecha: serverTimestamp(),
        usuarioUid: auth.currentUser?.uid || null,
        estado: "simulado",
      });

      // Mostramos la confirmación solamente si se guardó correctamente.
      setPedidoConfirmado({
        numero: documentoPedido.id,
        fecha: new Date().toLocaleString("es-AR"),
        total: total,
        cantidad: cantidadTotal,
      });

      vaciarCarrito();
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      setError("No se pudo guardar el pedido. Intentá nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  // Pantalla de confirmación.
  if (pedidoConfirmado) {
    return (
      <section className="carrito">
        <h1>¡Pedido confirmado!</h1>

        <p>Gracias por tu compra en Faro Shop.</p>

        <p>
          Número de pedido: <strong>{pedidoConfirmado.numero}</strong>
        </p>

        <p>Fecha: {pedidoConfirmado.fecha}</p>

        <p>
          Cantidad de unidades: {pedidoConfirmado.cantidad}
        </p>

        <h2>
          Total del pedido: $
          {pedidoConfirmado.total.toLocaleString("es-AR")}
        </h2>

        <p>
          Esta es una confirmación simulada. No se realizó ningún
          pago ni se modificó el stock.
        </p>

        <Link className="boton" to="/productos">
          Seguir comprando
        </Link>
      </section>
    );
  }

  // Carrito vacío.
  if (carrito.length === 0) {
    return (
      <section className="carrito">
        <h1>Carrito de compras</h1>

        <p>Tu carrito está vacío.</p>

        {mensaje && <p>{mensaje}</p>}

        <Link className="boton" to="/productos">
          Ver productos
        </Link>
      </section>
    );
  }

  // Carrito con productos.
  return (
    <section className="carrito">
      <h1>Carrito de compras</h1>

      <p>Unidades en el carrito: {cantidadTotal}</p>

      {mensaje && <p>{mensaje}</p>}

      {error && <p className="error">{error}</p>}

      <div className="carrito-productos">
        {carrito.map((producto) => {
          const subtotal =
            Number(producto.precio) * producto.cantidad;

          return (
            <article className="carrito-item" key={producto.id}>
              <img
                src={producto.imagen}
                alt={producto.nombre}
              />

              <div className="carrito-item-info">
                <h2>{producto.nombre}</h2>

                <p>Categoría: {producto.categoria}</p>

                <p>Precio por unidad: ${producto.precio}</p>

                <p>Cantidad seleccionada: {producto.cantidad}</p>

                <p>Stock disponible: {producto.stock} unidades</p>

                <p className="precio">Subtotal: ${subtotal}</p>

                <button
                  className="boton"
                  type="button"
                  onClick={() => quitarDelCarrito(producto.id)}
                >
                  Quitar producto
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="carrito-total">
        <h2>
          Total de la compra: ${total.toLocaleString("es-AR")}
        </h2>

        <button
          className="boton"
          type="button"
          onClick={confirmarCompra}
          disabled={cargando}
        >
          {cargando ? "Guardando pedido..." : "Confirmar compra"}
        </button>

        <button
          className="boton"
          type="button"
          onClick={vaciarCarrito}
          disabled={cargando}
        >
          Vaciar carrito
        </button>

        <p>
          <Link className="volver" to="/productos">
            ← Seguir comprando
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Carrito;



