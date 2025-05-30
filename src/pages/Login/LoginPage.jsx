import "./LoginPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      localStorage.setItem("access_token", response.data.access_token);

      const userData = {
        name: email.split('@')[0],
        email: email
      };

      login(userData);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">💰 Minha Carteira</div>
        <h2>Entrar</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="button" type="submit">Acessar</button>
        </form>

        <div className="register-link">
          <a href="#">Criar minha conta</a>
        </div>
      </div>
    </div>
  );
}
