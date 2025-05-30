import "./Header.css";

export default function Header({ user }) {
  return (
    <header className="app-header mb-3">
      <div className="header-right">
        {user ? `Olá, ${user.name} 😊` : "Olá, visitante"}
      </div>
    </header>
  );
}
