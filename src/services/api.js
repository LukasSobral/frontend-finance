import axios from "axios";

// Configuração do Axios para a API ##### Local ####
// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

// const api = axios.create({
//   baseURL: "http://192.168.0.117:8000/api",
// });

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) {
          throw new Error("Sem refresh token.");
        }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/refresh",
        {
          refresh_token: refresh_token,
        }
      );
   

        const { access_token } = response.data;

        localStorage.setItem("access_token", access_token);

        //Atualiza a Authorization e reenvia a requisição
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erro ao renovar token:", refreshError);
        //Se falhar, limpa tokens e redireciona para login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
