import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import './ModalTransaction.css';


Modal.setAppElement('#root');

export default function ModalTransaction({ isOpen, onClose, onSuccess }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('DESPESA');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState([]);

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
    try {
      await api.post('/transactions', {
        description,
        amount: parseFloat(amount),
        type,
        category_id: parseInt(categoryId),
        date
      });
      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('DESPESA');
    setCategoryId('');
    setDate('');
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

        <h2>Nova Transação</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          />

          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Selecione uma categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
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

          <button className="button" type="submit">Salvar</button>
        </form>
    </Modal>

  );
}
