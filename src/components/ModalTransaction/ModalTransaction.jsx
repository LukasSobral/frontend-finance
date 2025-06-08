import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import './ModalTransaction.css';

Modal.setAppElement('#root');

export default function ModalTransaction({ isOpen, onClose, onSuccess, transaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('DESPESA');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Preenche dados no modo edição
  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString().replace('.', ','));
      setType(transaction.type);
      setCategoryId(transaction.category_id?.toString() || '');
      setDate(transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '');
    } else {
      resetForm();
    }
  }, [transaction]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const payload = {
      description,
      amount: parseFloat(amount.replace(',', '.')),
      type,
      category_id: parseInt(categoryId),
      date,
    };

    try {
      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }

      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      setErrorMessage("Não foi possível salvar a transação. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('DESPESA');
    setCategoryId('');
    setDate('');
    setErrorMessage('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Nova Transação"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button className="modal-close" onClick={onClose}>×</button>
      <h2>{transaction ? 'Editar Transação' : 'Nova Transação'}</h2>

      <form onSubmit={handleSubmit} className="modal-form">
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          required
          autoFocus
        />

        <input
          type="text"
          placeholder="Valor (ex: 25,00)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Selecione uma categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="RECEITA">Receita</option>
          <option value="DESPESA">Despesa</option>
        </select>

        {errorMessage && <div className="modal-error">{errorMessage}</div>}

        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </Modal>
  );
}
