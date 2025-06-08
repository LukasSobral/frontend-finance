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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const token = response.data.access_token;
      localStorage.setItem("access_token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 🔥 Buscar dados reais do usuário
      const me = await api.get("/auth/me");
      login(me.data); // agora terá name, email, is_admin, etc.

      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("E-mail ou senha inválidos.");
      } else {
        setErrorMessage("Erro ao fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
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
            autoComplete="email"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Acessar"}
          </button>
        </form>

        <div className="register-link">
          <a href="#">Criar minha conta</a>
        </div>
      </div>
    </div>
  );
}
