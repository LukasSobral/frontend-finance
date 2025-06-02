import { NavLink } from "react-router-dom";
import { FiHome, FiList, FiTag, FiUser, FiLogOut } from "react-icons/fi";
import { Nav } from "react-bootstrap";
import "./Sidebar.css";

export default function Sidebar({ onLogout, onNavigate }) {
  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">🪙 Minha Carteira</div>
        <Nav className="nav-section">
          <Nav.Link as={NavLink} to="/dashboard" className="link-custom" onClick={handleClick}>
            <FiHome /> Dashboard
          </Nav.Link>
          <Nav.Link as={NavLink} to="/transactions" className="link-custom" onClick={handleClick}>
            <FiList /> Transações
          </Nav.Link>
          <Nav.Link as={NavLink} to="/categories" className="link-custom" onClick={handleClick}>
            <FiTag /> Categorias
          </Nav.Link>
          <Nav.Link as={NavLink} to="/profile" className="link-custom" onClick={handleClick}>
            <FiUser /> Meu Perfil
          </Nav.Link>

          {/* Botão de sair - mobile (estilo compacto) */}
          <Nav.Link as="button" className="btn-logout-mobile" onClick={onLogout}>
            <FiLogOut style={{ marginRight: 6 }} /> Sair
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
}
