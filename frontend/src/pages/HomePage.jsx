import React from "react";
import "../styles/HomePage.css"; 
import imagen from "../assets/imgHomePage.jpg"
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const funcionalidades = [
    "📅 Reserva de turnos online",
    "🔔 Recordatorios por email",
    "👤 Registro e inicio de sesión de usuarios",
    "🐶 Gestión de pacientes (mascotas)",
    "📋 Panel administrativo para citas",
    "❌ Cancelación y modificación de turnos"
  ];

  const stackTecnologico = [
    { nombre: "React", icono: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { nombre: "Node.js", icono: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { nombre: "Express", icono: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
    { nombre: "PostgreSQL", icono: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { nombre: "HTML5", icono: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { nombre: "CSS3", icono: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" }
  ];
  const conceptosAplicados = [
    "🔁 Arquitectura cliente-servidor",
    "🧠 Manejo de estado con React",
    "🔐 Autenticación con JWT",
    "🌐 Comunicación con APIs REST",
    "📅 Manejo de fechas en JavaScript",
    "📥 Validación de formularios"
  ];

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="logo">🐶 Vet Citas</h1>
        <div className="nav-buttons">
          <button className="btn-outline" onClick={() => navigate('/login')}>Iniciar sesión</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Registrarse</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-play">▶</div>
        <button className="btn-primary">Ver demo</button>
      </section>

      {/* Descripción */}
      <section className="section">
        <h2>¿Qué es este proyecto?</h2>
        <p>
          VetCitas permite a veterinarias gestionar turnos de forma simple. Los clientes pueden reservar online y los administradores pueden ver, modificar o cancelar citas desde un panel intuitivo.
        </p>
        <div className="placeholder-box"></div>
        <img src={imagen} alt="Imagen" className="project-image" />
      </section>

      {/* Funcionalidades principales */}
      <section className="section">
        <h2>Funcionalidades principales</h2>
        <div className="grid-box">
          {funcionalidades.map((funcionalidad, i) => (
            <div key={i} className="concept-box" style={{ padding: "8px" }}>
              {funcionalidad}
            </div>
          ))}
        </div>
      </section>

      {/* Stack tecnológico */}
      <section className="section section-light">
        <h2>Stack tecnológico</h2>
        <div className="grid-box">
          {stackTecnologico.map((item, i) => (
            <div key={i} className="stack-box" title={item.nombre}>
              <img src={item.icono} alt={item.nombre} style={{ height: "40px" }} />
              <span>{item.nombre}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Conceptos aplicados */}
      <section className="section">
        <h2>Conceptos aplicados</h2>
        <p>
          Conceptos claves que se utilizaron en el desarrollo del proyecto tanto del lado del front como del back.
        </p>
        <div className="grid-box">
          {conceptosAplicados.map((concepto, i) => (
            <div key={i} className="concept-box" style={{ padding: "8px" }}>
              {concepto}
            </div>
          ))}
        </div>

      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <div className="footer-left">
            <span>Mobile app</span>
            <span>Community</span>
            <span>Company</span>
          </div>
          <div className="footer-right">
            <span>Help desk</span>
            <span>Blog</span>
            <span>Resources</span>
          </div>
        </div>
        <p className="copyright">© Photo, Inc. 2024. We love our users!</p>
      </footer>
    </div>
  );
}
