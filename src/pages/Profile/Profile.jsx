import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, login } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const isAdmin = user?.is_admin;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback("");

    try {
      const payload = { name, email };
      if (password) payload.password = password;

      const response = await api.put("/users/me", payload);
      login(response.data);  // atualiza contexto
      setFeedback("Perfil atualizado com sucesso!");

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setFeedback("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Meu Perfil</h1>

      {feedback && <div className="profile-alert">{feedback}</div>}

      <form onSubmit={handleSubmit}>
        <label>Nome</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          required 
        />

        <label>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        <label>Nova Senha (opcional)</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />

        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </form>

      {isAdmin && (
        <div className="admin-section">
          <h2>Seção Administrativa</h2>
          <p>Você é um administrador e pode gerenciar contas de outros usuários.</p>
          <button className="button-admin" onClick={() => alert("TODO: abrir painel de usuários")}>
            Gerenciar Usuários
          </button>
        </div>
      )}
    </div>
  );
}
