
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Agregar un producto respetando el stock
  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(
      (item) => item.id === producto.id
    );

    const cantidadActual = productoExistente
      ? productoExistente.cantidad
      : 0;

    if (cantidadActual >= producto.stock) {
      setMensaje(
        `No hay más stock disponible de ${producto.nombre}.`
      );
      return false;
    }

    if (productoExistente) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad: 1,
        },
      ]);
    }

    setMensaje(`${producto.nombre} se agregó al carrito.`);
    return true;
  };

  // Quitar un producto completo del carrito
  const quitarDelCarrito = (id) => {
    setCarrito(
      carrito.filter((item) => item.id !== id)
    );
    setMensaje("");
  };

  // Vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    setMensaje("");
  };

  // Calcular la cantidad total de unidades
  const cantidadTotal = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        mensaje,
        agregarAlCarrito,
        quitarDelCarrito,
        vaciarCarrito,
        cantidadTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
