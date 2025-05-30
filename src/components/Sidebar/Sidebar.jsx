import { NavLink } from "react-router-dom";
import { FiHome, FiList, FiTag, FiUser, FiLogOut } from "react-icons/fi";
import { Nav } from "react-bootstrap";
import "./Sidebar.css";

export default function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          🪙 Minha Carteira
        </div>

        <Nav className="nav-section">
          <Nav.Link as={NavLink} to="/dashboard" className="link-custom">
            <FiHome /> Dashboard
          </Nav.Link>
          <Nav.Link as={NavLink} to="/transactions" className="link-custom">
            <FiList /> Transações
          </Nav.Link>
          <Nav.Link as={NavLink} to="/categories" className="link-custom">
            <FiTag /> Categorias
          </Nav.Link>
          <Nav.Link as={NavLink} to="/profile" className="link-custom">
            <FiUser /> Meu Perfil
          </Nav.Link>
        </Nav>
      </div>

      <div className="sidebar-footer">
        <button className="btn-custom" onClick={onLogout}>
          <FiLogOut /> Sair
        </button>
      </div>
    </div>
  );
}
