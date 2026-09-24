function Footer() {
  const personas = [
    {
      nombre: "Ana García",
      puesto: "Diseñadora"
    },
    {
      nombre: "Juan Pérez",
      puesto: "Desarrollador"
    },
    {
      nombre: "Laura López",
      puesto: "Administradora"
    }
  ];

  return (
    <footer className="footer">

      <div className="empresa">
        <h2>Faro Shop</h2>

        <p>
          Somos una tienda online dedicada a ofrecer
          productos útiles, modernos y accesibles.
        </p>

        <p>Buenos Aires, Argentina</p>
        <p>contacto@faroshop.com</p>
      </div>

      <div className="equipo">
        <h2>Nuestro equipo</h2>

        <div className="personas">

          {personas.map((persona) => (
            <div
              className="tarjeta-persona"
              key={persona.nombre}
            >
              <div className="avatar">
                {persona.nombre.charAt(0)}
              </div>

              <h3>{persona.nombre}</h3>

              <p>{persona.puesto}</p>
            </div>
          ))}

        </div>
      </div>

      <div className="copyright">
        <p>
          © 2026 Faro Shop - Todos los derechos reservados.
        </p>
      </div>

    </footer>
  );
}

export default Footer;