import React, { useState } from 'react';
import api from '../../services/api';

export default function TransactionForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'RECEITA',
    category_id: '',
    date: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
      });
      onSuccess();  // Atualiza a lista
      onClose();    // Fecha o modal
    } catch (error) {
      console.error("Erro ao criar transação", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Valor:
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
      </label>
      <label>
        Tipo:
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="RECEITA">Receita</option>
          <option value="DESPESA">Despesa</option>
        </select>
      </label>
      <label>
        Categoria ID:
        <input type="number" name="category_id" value={formData.category_id} onChange={handleChange} required />
      </label>
      <label>
        Data:
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      </label>
      <label>
        Descrição:
        <input type="text" name="description" value={formData.description} onChange={handleChange} required />
      </label>

      <button type="submit" className="button">Salvar</button>
    </form>
  );
}
