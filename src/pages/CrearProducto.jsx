
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import "./CrearProducto.css";

const COLECCION = "productos nacionales";

function CrearProducto() {
    const navigate = useNavigate();

    const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    imagen: "",
    precio: "",
    stock: "",
});

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    function manejarCambio(evento) {
    const { name, value } = evento.target;

    setProducto((actual) => ({
        ...actual,
        [name]: value,
    }));
}

async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");

    if (
        !producto.nombre.trim() ||
        !producto.descripcion.trim() ||
        !producto.categoria.trim() ||
        producto.precio === "" ||
        producto.stock === ""
        ) {
    setError("Completá todos los campos obligatorios.");
    return;
}

    if (
        !Number.isFinite(Number(producto.precio)) ||
        Number(producto.precio) < 0 ||
        !Number.isInteger(Number(producto.stock)) ||
        Number(producto.stock) < 0
    ) {
        setError("El precio debe ser válido y el stock un entero no negativo.");
        return;
    }

    try {
        setGuardando(true);

    await addDoc(collection(db, COLECCION), {
        nombre: producto.nombre.trim(),
        descripcion: producto.descripcion.trim(),
        categoria: producto.categoria.trim(),
        imagen: producto.imagen.trim(),
        precio: Number(producto.precio),
        stock: Number(producto.stock),
});

    navigate("/productos");
    } catch (error) {
    console.error("Error al crear el producto:", error);
    setError("No se pudo guardar el producto en Firestore.");
    } finally {
    setGuardando(false);
    }
}

return (
    <section className="formulario-producto">
        <h1>Crear producto</h1>

    <form onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={producto.nombre}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={producto.descripcion}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="categoria">Categoría</label>
        <input
          id="categoria"
          name="categoria"
          value={producto.categoria}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="imagen">URL de la imagen (opcional)</label>
        <input
          id="imagen"
          name="imagen"
          type="url"
          value={producto.imagen}
          onChange={manejarCambio}
          placeholder="https://..."
        />

        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          value={producto.precio}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={producto.stock}
          onChange={manejarCambio}
          required
        />

        {error && (
            <p className="mensaje-error" role="alert">
              {error}
            </p>
)}

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar producto"}
        </button>
      </form>
    </section>
  );
}

export default CrearProducto;
