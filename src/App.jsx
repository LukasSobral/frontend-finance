import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import TransactionsList from "./pages/Transaction/TransactionsList";
import CategoriesList from "./pages/Category/CategoriesList";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Profile from "./pages/Profile/Profile";
import "../styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Protegidas */}
        <Route path="/" element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<TransactionsList />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
