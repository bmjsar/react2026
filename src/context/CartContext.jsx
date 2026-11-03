
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Agregar productos sin modificar Firestore.
  const agregarAlCarrito = (producto) => {
    const stockDisponible = Number(producto.stock ?? 0);

    const existente = carrito.find(
      (item) => item.id === producto.id
    );

    const cantidadActual = existente
      ? existente.cantidad
      : 0;

    if (stockDisponible <= 0) {
      setMensaje(`No hay stock disponible de ${producto.nombre}.`);
      return false;
    }

    if (cantidadActual >= stockDisponible) {
      setMensaje(
        `No podés agregar más unidades de ${producto.nombre}. Stock disponible: ${stockDisponible}.`
      );
      return false;
    }

    setCarrito((anterior) => {
      const itemExistente = anterior.find(
        (item) => item.id === producto.id
      );

      if (itemExistente) {
        return anterior.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      return [
        ...anterior,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    });

    setMensaje(`${producto.nombre} se agregó al carrito.`);
    return true;
  };

  // Quitar productos sin modificar Firestore.
  const quitarDelCarrito = (id) => {
    setCarrito((anterior) =>
      anterior.filter((item) => item.id !== id)
    );

    setMensaje("Producto quitado del carrito.");
  };

  // Vaciar el carrito sin modificar Firestore.
  const vaciarCarrito = () => {
    setCarrito([]);
    setMensaje("El carrito está vacío.");
  };

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




