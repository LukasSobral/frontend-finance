import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, login } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { name, email };
      if (password) payload.password = password;

      const response = await api.put("/users/me", payload);

      login(response.data);  // Atualiza contexto
      alert("Perfil atualizado com sucesso!");

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil");
    }
  };

  return (
    <div className="profile-container">
      <h1>Meu Perfil</h1>

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

        <button className="button" type="submit">Salvar</button>
      </form>
    </div>
  );
}
