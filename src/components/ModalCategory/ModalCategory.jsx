import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import './ModalCategory.css';

Modal.setAppElement('#root');

export default function ModalCategory({ isOpen, onClose, onSuccess, category = null }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (category) {
        // Atualizar
        await api.put(`/categories/${category.id}`, { name, description });
      } else {
        // Criar
        await api.post('/categories', { name, description });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Categoria"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>{category ? 'Editar Categoria' : 'Nova Categoria'}</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <button className="button" type="submit">
          {category ? 'Atualizar' : 'Salvar'}
        </button>
      </form>
    </Modal>
  );
}
