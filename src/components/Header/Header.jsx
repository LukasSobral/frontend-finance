import "./Header.css";
import { FaUserCircle } from "react-icons/fa";

export default function Header({ user }) {
  return (
    <header className="app-header mb-3">
      <div className="header-right">
        <FaUserCircle className="user-icon" />
        <span>{user ? `Olá, ${user.name} 😊` : "Olá, visitante"}</span>
      </div>
    </header>
  );
}
