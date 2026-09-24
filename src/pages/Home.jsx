import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="home">

      <h1>
        Bienvenido a Faro Shop
      </h1>

      <p>
        Encontrá productos para tu día a día
        en nuestra tienda online.
      </p>

      <Link
        className="boton"
        to="/productos"
      >
        Ver productos
      </Link>

    </section>
  );
}

export default Home;