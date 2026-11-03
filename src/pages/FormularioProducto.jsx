
import { useEffect, useState } from "react";
import "./FormularioProducto.css";

const formularioVacio = {
  nombre: "",
  descripcion: "",
  categoria: "",
  imagen: "",
  precio: "",
  stock: "",
};

function FormularioProducto({
  productoInicial,
  onGuardar,
  onCancelar,
  guardando,
}) {
  const [producto, setProducto] = useState(formularioVacio);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productoInicial) {
      setProducto({
        nombre: productoInicial.nombre ?? "",
        descripcion: productoInicial.descripcion ?? "",
        categoria: productoInicial.categoria ?? "",
        imagen: productoInicial.imagen ?? "",
        precio: String(productoInicial.precio ?? ""),
        stock: String(productoInicial.stock ?? ""),
      });
    } else {
      setProducto(formularioVacio);
    }

    setError("");
  }, [productoInicial]);

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

    const precio = Number(producto.precio);
    const stock = Number(producto.stock);

    if (!Number.isFinite(precio) || precio < 0) {
      setError("Ingresá un precio válido, igual o mayor que cero.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("El stock debe ser un entero igual o mayor que cero.");
      return;
    }

    const datos = {
      nombre: producto.nombre.trim(),
      descripcion: producto.descripcion.trim(),
      categoria: producto.categoria.trim(),
      imagen: producto.imagen.trim(),
      precio,
      stock,
    };

    try {
      await onGuardar(datos);

      if (!productoInicial) {
        setProducto(formularioVacio);
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setError("No se pudo guardar el producto. Intentá nuevamente.");
    }
  }

  return (
    <section className="formulario-producto">
      <h2>
        {productoInicial ? "Editar producto" : "Crear producto"}
      </h2>

      <form onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={producto.nombre}
          onChange={manejarCambio}
          required
          maxLength={100}
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={producto.descripcion}
          onChange={manejarCambio}
          required
          maxLength={1000}
        />

        <label htmlFor="categoria">Categoría</label>
        <input
          id="categoria"
          name="categoria"
          value={producto.categoria}
          onChange={manejarCambio}
          required
          maxLength={80}
        />

        <label htmlFor="imagen">URL de imagen (opcional)</label>
        <input
          id="imagen"
          name="imagen"
          type="url"
          placeholder="https://..."
          value={producto.imagen}
          onChange={manejarCambio}
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
          {guardando
            ? "Guardando..."
            : productoInicial
              ? "Guardar cambios"
              : "Crear producto"}
        </button>

        {productoInicial && (
          <button
            type="button"
            className="boton-cancelar"
            onClick={onCancelar}
            disabled={guardando}
          >
            Cancelar edición
          </button>
        )}
      </form>
    </section>
  );
}

export default FormularioProducto;
