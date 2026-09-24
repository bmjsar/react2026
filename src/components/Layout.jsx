import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="layout">

      <Header />

      <NavBar />

      <main className="contenido">
        {children}
      </main>

      <Footer />

    </div>
  );
}

export default Layout;