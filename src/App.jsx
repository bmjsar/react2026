
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import CrearProducto from "./pages/CrearProducto";
import Home from "./pages/Home";
import ItemListContainer from "./components/ItemListContainer";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import ProductoNacionalDetalle from "./pages/ProductoNacionalDetalle";
import Panel from "./pages/Panel";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, "")}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ItemListContainer />} />
          <Route path="/crear-producto" element={<CrearProducto />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route
            path="/productos-nacionales/:id"
            element={<ProductoNacionalDetalle />}
          />
          <Route
  path="/panel"
  element={
    <ProtectedRoute rolesPermitidos={["admin"]}>
      <Panel />
    </ProtectedRoute>
  }
/>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

       