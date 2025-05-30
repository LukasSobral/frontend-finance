import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Row, Col, Form, Button } from "react-bootstrap";
import './Dashboard.css';
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export default function Dashboard() {
  useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSummary = async () => {
    try {
      let query = "";
      if (startDate) query += `start_date=${startDate}&`;
      if (endDate) query += `end_date=${endDate}`;
      const response = await api.get(`/transactions/summary?${query}`);
      setSummary(response.data);
    } catch (error) {
      console.error("Erro ao buscar resumo:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions?limit=5");
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchSummary();
  };

  if (!summary) return <p className="text-light">Carregando...</p>;

  const barData = [
    { name: 'Receitas', valor: summary.total_income },
    { name: 'Despesas', valor: summary.total_expense },
    { name: 'Saldo', valor: summary.balance },
  ];

  const lineData = [
    { month: 'Jan', balance: 1200 },
    { month: 'Feb', balance: 1500 },
    { month: 'Mar', balance: 1000 },
    { month: 'Abr', balance: 1300 },
    { month: 'Mai', balance: 1600 },
  ];

  return (
    <div className="dashboard-container text-light">
      <h1 className="mb-4 dashboard-title">Dashboard</h1>

      <Form className="row g-2 mb-4" onSubmit={handleFilter}>
        <div className="col-12 col-md-auto">
          <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="col-12 col-md-auto">
          <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="col-12 col-md-auto">
          <Button type="submit" className="btn-custom w-100">Filtrar</Button>
        </div>
      </Form>

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <div className="card-custom card-saldo">
            <h2>Saldo Atual</h2>
            <p className="kpi-value">R$ {summary.balance.toFixed(2)}</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="card-custom card-receitas">
            <h2>Receitas</h2>
            <p className="kpi-value">R$ {summary.total_income.toFixed(2)}</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="card-custom card-despesas">
            <h2>Despesas</h2>
            <p className="kpi-value">R$ {summary.total_expense.toFixed(2)}</p>
          </div>
        </Col>
      </Row>

      <div className="card-custom mb-4">
        <h2>Últimas Transações</h2>
        {transactions.map((t) => (
          <div key={t.id} className="transaction-item">
            <span>{t.description}</span>
            <span className="text-end">R$ {t.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Row className="g-3 mb-4">
        <Col xs={12} md={6}>
          <div className="card-custom">
            <h2>Relação</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Entradas", value: summary.total_income },
                    { name: "Saídas", value: summary.total_expense }
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#36A2EB" />
                  <Cell fill="#FF6384" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={12} md={6}>
          <div className="card-custom">
            <h2>Resumo Financeiro</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#36A2EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* Gráfico de Linha - Histórico de Gastos */}
      <div className="card-custom mb-4">
        <h2>Histórico de Gastos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#FF6384" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
