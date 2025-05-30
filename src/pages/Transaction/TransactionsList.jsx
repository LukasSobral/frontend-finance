import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalTransaction from '../../components/ModalTransaction/ModalTransaction';
import ModalConfirmDelete from '../../components/ModalConfirmDelete/ModalConfirmDelete';
import './TransactionsList.css';

export default function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("TODAS");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      let query = "";
      if (startDate) query += `start_date=${startDate}&`;
      if (endDate) query += `end_date=${endDate}`;
      const response = await api.get(`/transactions?${query}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao filtrar:", error);
    }
  };

  const filteredTransactions = filterType === "TODAS"
    ? transactions
    : transactions.filter(t => t.type === filterType);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/transactions/${transactionToDelete.id}`);
      setIsConfirmOpen(false);
      setTransactionToDelete(null);
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  return (
    <div className="transactions-container">
      <form onSubmit={handleFilter} className="filter-form">
        <div className="filter-top">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button className="button new-transaction" type="button" onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}>
            <span className="d-none d-md-inline">Nova Transação</span>
            <span className="d-inline d-md-none">+</span>
          </button>
        </div>

        <button className="button filter-btn" type="submit">Filtrar</button>
      </form>

      <div className="transactions-toggle">
        <button
          className={`toggle-btn ${filterType === 'DESPESA' ? 'active' : ''}`}
          type="button"
          onClick={() => setFilterType("DESPESA")}
        >
          Despesas
        </button>
        <button
          className={`toggle-btn ${filterType === 'RECEITA' ? 'active' : ''}`}
          type="button"
          onClick={() => setFilterType("RECEITA")}
        >
          Receitas
        </button>
        <button
          className={`toggle-btn ${filterType === 'TODAS' ? 'active' : ''}`}
          type="button"
          onClick={() => setFilterType("TODAS")}
        >
          Todas
        </button>
      </div>

      <div className="transactions-list">
        {filteredTransactions.map((t) => (
          <div
            key={t.id}
            className={`transaction-card ${t.type === "RECEITA" ? "receita" : "despesa"}`}
          >
            <div className="transaction-card-content">
              <div className="transaction-description">
                {t.description}
              </div>
              <div className="transaction-date">
                {new Date(t.date).toLocaleDateString()}
              </div>
            </div>
            <div className="transaction-value">
              R$ {t.amount.toFixed(2)}
            </div>
            <div className="transaction-actions">
              <button className="btn-edit" onClick={() => handleEdit(t)}>Editar</button>
              <button className="btn-delete" onClick={() => {
                setTransactionToDelete(t);
                setIsConfirmOpen(true);
              }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      <ModalTransaction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions}
        transaction={editingTransaction}
      />

      <ModalConfirmDelete
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        itemName={transactionToDelete?.description}
      />
    </div>
  );
}
