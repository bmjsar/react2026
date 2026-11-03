
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-tienda">

      {/* PORTADA PRINCIPAL */}
      <section className="home-banner">
        <div className="home-banner-contenido">
          <span className="home-etiqueta">
            BIENVENIDO A FARO SHOP
          </span>

          <h1>
            Encontrá lo que buscás,
            <br />
            disfrutá cada momento.
          </h1>

          <p>
            Productos para tu día a día, con estilo,
            calidad y comodidad.
          </p>

          <Link className="home-boton-principal" to="/productos">
            Explorar productos
          </Link>
        </div>

        <div className="home-banner-decoracion">
          <span>F</span>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="home-categorias">
        <div className="home-seccion-titulo">
          <span>DESCUBRÍ NUESTRA TIENDA</span>
          <h2>Explorá nuestras categorías</h2>
          <p>Encontrá productos pensados para vos.</p>
        </div>

        <div className="home-categorias-grid">

          <Link
            to="/productos?categoria=Hogar"
            className="home-categoria home-hogar"
          >
            <span className="home-categoria-icono">⌂</span>
            <h3>Hogar</h3>
            <p>Todo para tus espacios.</p>
            <span className="home-categoria-enlace">
              Explorar →
            </span>
          </Link>

          <Link
            to="/productos?categoria=Ropa"
            className="home-categoria home-ropa"
          >
            <span className="home-categoria-icono">✦</span>
            <h3>Ropa</h3>
            <p>Estilo para cada ocasión.</p>
            <span className="home-categoria-enlace">
              Explorar →
            </span>
          </Link>

          <Link
            to="/productos?categoria=Accesorios"
            className="home-categoria home-accesorios"
          >
            <span className="home-categoria-icono">◇</span>
            <h3>Accesorios</h3>
            <p>Detalles que hacen la diferencia.</p>
            <span className="home-categoria-enlace">
              Explorar →
            </span>
          </Link>

        </div>
      </section>

      {/* ACCESO A CLIENTES */}
      <section className="home-cuenta">
        <div>
          <span>FORMÁ PARTE DE FARO SHOP</span>
          <h2>Tu próxima compra comienza acá.</h2>
          <p>
            Creá tu cuenta o ingresá para acceder a tu experiencia
            de compra.
          </p>
        </div>

        <div className="home-cuenta-botones">
          <Link to="/login" className="home-boton-login">
            Iniciar sesión
          </Link>

          <Link to="/registro" className="home-boton-registro">
            Registrarme
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;