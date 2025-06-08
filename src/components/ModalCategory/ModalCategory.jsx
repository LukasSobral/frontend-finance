import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import './ModalCategory.css';

Modal.setAppElement('#root');

export default function ModalCategory({ isOpen, onClose, onSuccess, category = null }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
    } else {
      resetForm();
    }
  }, [category]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setErrorMessage('');
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (category) {
        await api.put(`/categories/${category.id}`, { name, description });
      } else {
        await api.post('/categories', { name, description });
      }
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      setErrorMessage('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        resetForm();
        onClose();
      }}
      contentLabel="Categoria"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button className="modal-close" onClick={onClose}>×</button>
      <h2>{category ? 'Editar Categoria' : 'Nova Categoria'}</h2>

      <form onSubmit={handleSubmit} className="modal-form">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {errorMessage && <div className="modal-error">{errorMessage}</div>}

        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? (category ? 'Atualizando...' : 'Salvando...') : (category ? 'Atualizar' : 'Salvar')}
        </button>
      </form>
    </Modal>
  );
}
