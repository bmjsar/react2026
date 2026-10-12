
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Carrito() {
  const {
    carrito,
    quitarDelCarrito,
    vaciarCarrito,
    cantidadTotal,
  } = useCart();

  const total = carrito.reduce(
    (acumulado, producto) =>
      acumulado + producto.precio * producto.cantidad,
    0
  );

  if (carrito.length === 0) {
    return (
      <section className="carrito">
        <h1>Carrito de compras</h1>

        <p>Tu carrito está vacío.</p>

        <Link className="boton" to="/productos">
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section className="carrito">
      <h1>Carrito de compras</h1>

      <p>Unidades en el carrito: {cantidadTotal}</p>

      <div className="carrito-productos">
        {carrito.map((producto) => {
          const stockRestante =
            producto.stock - producto.cantidad;

          const subtotal =
            producto.precio * producto.cantidad;

          return (
            <article
              className="carrito-item"
              key={producto.id}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
              />

              <div className="carrito-item-info">
                <h2>{producto.nombre}</h2>

                <p>
                  Categoría: {producto.categoria}
                </p>

                <p>
                  Precio por unidad: ${producto.precio}
                </p>

                <p>
                  Cantidad seleccionada: {producto.cantidad}
                </p>

                <p>
                  Stock inicial: {producto.stock} unidades
                </p>

                <p>
                  Stock restante: {stockRestante} unidades
                </p>

                <p className="precio">
                  Subtotal: ${subtotal}
                </p>

                <button
                  className="boton"
                  onClick={() =>
                    quitarDelCarrito(producto.id)
                  }
                >
                  Quitar producto
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="carrito-total">
        <h2>Total de la compra: ${total}</h2>

        <button
          className="boton"
          onClick={vaciarCarrito}
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

