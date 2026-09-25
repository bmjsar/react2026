import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import ItemListContainer from "./components/ItemListContainer";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";

function App() {
  return (
<BrowserRouter
  basename={import.meta.env.PROD ? "/react2026" : "/"}
>
      <Layout>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/productos"
            element={<ItemListContainer />}
          />

          <Route
            path="/producto/:id"
            element={<ProductoDetalle />}
          />

          <Route
            path="/carrito"
            element={<Carrito />}
          />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;