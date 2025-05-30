import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { Navbar, Offcanvas } from "react-bootstrap";
import { useState } from "react";
import "./Layout.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleLogout = () => {
    logout();
    setFeedback("Logout realizado com sucesso!");
    setTimeout(() => setFeedback(""), 1500);
  };

  return (
    <div className="layout">
      {/* Sidebar fixa - apenas no desktop */}
      <aside className="sidebar d-none d-md-flex flex-column">
        <h5 className="text-light">💰 Minha Carteira</h5>
        <Sidebar onLogout={handleLogout} />
      </aside>

      <div className="main-content">
        {/* Navbar - só no mobile */}
        <Navbar className="bg-card-custom d-flex d-md-none justify-content-between align-items-center px-3">
          <div>
            <Navbar.Brand className="text-light mb-0">💰 Minha Carteira</Navbar.Brand>
            <div className="text-light small">Olá, {user?.name} 😊</div>
          </div>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            style={{ display: 'block' }}
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </Navbar.Toggle>
        </Navbar>

        {/* Offcanvas - só no mobile */}
        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          className="text-light"
          placement="start"
          id="offcanvasNavbar"
          style={{
            backgroundColor: "var(--background-card)",
            color: "var(--text-light)"
          }}
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title className="text-light">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Sidebar onLogout={handleLogout} />
          </Offcanvas.Body>
        </Offcanvas>

        <div className="inner-content">
          {/* Feedback aparece sempre */}
          {feedback && (
            <div className="alert alert-success text-center">{feedback}</div>
          )}

          {/* Header só no desktop */}
          <div className="d-none d-md-block">
            <Header user={user} />
          </div>

          <div className="container py-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
