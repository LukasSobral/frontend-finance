import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalTransaction from "../../components/ModalTransaction/ModalTransaction";
import ModalConfirmDelete from "../../components/ModalConfirmDelete/ModalConfirmDelete";
import "./TransactionsList.css";

export default function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("TODAS");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [limit] = useState(6);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransactions = async (reset = false) => {
    try {
      let query = `?limit=${limit}&offset=${reset ? 0 : offset}`;
      if (startDate) query += `&start_date=${startDate}`;
      if (endDate) query += `&end_date=${endDate}`;

      const response = await api.get(`/transactions${query}`);
      const newData = response.data;

      if (reset) {
        setTransactions(newData);
        setOffset(limit);
      } else {
        setTransactions((prev) => [...prev, ...newData]);
        setOffset((prev) => prev + limit);
      }

      setHasMore(newData.length === limit);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  useEffect(() => {
    fetchTransactions(true);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setOffset(0);
    fetchTransactions(true);
  };

  const filteredTransactions =
    filterType === "TODAS"
      ? transactions
      : transactions.filter((t) => t.type === filterType);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/transactions/${transactionToDelete.id}`);
      setIsConfirmOpen(false);
      setTransactionToDelete(null);
      fetchTransactions(true);
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    }
  };

  const handleCreateSuccess = () => {
    fetchTransactions(true);
    setIsModalOpen(false);
  };

  return (
    <div className="transactions-container">

      {/* FILTRO MODERNO */}
      <div className="filter-bar">
        <div className="filter-left">
          <button
            type="button"
            className="btn-apply highlight"
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
          >
            ➕ Nova Transação
          </button>
        </div>

        <form className="filter-right" onSubmit={handleFilter}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button type="submit" className="btn-apply">🔍 Filtrar</button>
        </form>
      </div>

      {/* TOGGLE DE TIPO */}
      <div className="transactions-toggle">
        {["DESPESA", "RECEITA", "TODAS"].map((type) => (
          <button
            key={type}
            className={`toggle-btn ${filterType === type ? "active" : ""}`}
            onClick={() => setFilterType(type)}
          >
            {type === "TODAS" ? "Todas" : type === "RECEITA" ? "Receitas" : "Despesas"}
          </button>
        ))}
      </div>

      {/* TOTAL ENCONTRADO */}
      <div style={{ textAlign: "center", marginBottom: "12px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
        {filteredTransactions.length} {filterType.toLowerCase()} encontrada(s)
      </div>

      {/* LISTAGEM */}
      <div className="transactions-list">
        {filteredTransactions.map((t) => (
          <div
            key={t.id}
            className={`transaction-line ${t.type === "RECEITA" ? "receita" : "despesa"}`}
          >
            <div className="left">
              <div className="description">{t.description}</div>
              <div className="date">{new Date(t.date).toLocaleDateString()}</div>
            </div>
            <div className="right">
              <div className="amount">
                {t.type === "RECEITA" ? "R$" : "-R$"} {t.amount.toFixed(2)}
              </div>
              <div className="actions">
                <button className="btn-edit" onClick={() => handleEdit(t)}>✏️</button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    setTransactionToDelete(t);
                    setIsConfirmOpen(true);
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINAÇÃO */}
      {hasMore && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button className="btn-apply" onClick={() => fetchTransactions()}>
            Carregar mais
          </button>
        </div>
      )}

      {/* MODAIS */}
      <ModalTransaction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
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
