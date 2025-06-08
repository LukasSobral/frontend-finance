import { NavLink } from "react-router-dom";
import { FiHome, FiList, FiTag, FiUser, FiLogOut, FiUsers } from "react-icons/fi";
import { Nav } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // 🔹 IMPORTANTE
import "./Sidebar.css";

export default function Sidebar({ onLogout, onNavigate }) {
  const { user } = useAuth(); // 🔹 Acesso ao usuário logado

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">💰 Minha Carteira</div>

        <Nav className="nav-section">
          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/dashboard"
              className={({ isActive }) => `link-custom ${isActive ? "active" : ""}`}
              onClick={handleClick}
            >
              <FiHome /> Dashboard
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/transactions"
              className={({ isActive }) => `link-custom ${isActive ? "active" : ""}`}
              onClick={handleClick}
            >
              <FiList /> Transações
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/categories"
              className={({ isActive }) => `link-custom ${isActive ? "active" : ""}`}
              onClick={handleClick}
            >
              <FiTag /> Categorias
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/profile"
              className={({ isActive }) => `link-custom ${isActive ? "active" : ""}`}
              onClick={handleClick}
            >
              <FiUser /> Meu Perfil
            </Nav.Link>
          </Nav.Item>

          {/* 🔐 Apenas para admin */}
          {user?.is_admin && (
            <Nav.Item>
              <Nav.Link
                as={NavLink}
                to="/admin/users"
                className={({ isActive }) => `link-custom ${isActive ? "active" : ""}`}
                onClick={handleClick}
              >
                <FiUsers /> Gerenciar Usuários
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </div>

      {/* Botão de sair (desktop) */}
      <div className="sidebar-footer d-none d-md-flex">
        <button className="btn-custom" onClick={onLogout}>
          <FiLogOut /> Sair
        </button>
      </div>

      {/* Botão de sair (mobile) */}
      <div className="d-md-none mt-3">
        <button className="btn-logout-mobile" onClick={onLogout}>
          <FiLogOut /> Sair
        </button>
      </div>
    </div>
  );
}
