// ModalUser.jsx
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import './ModalUser.css';

Modal.setAppElement('#root');

export default function ModalUser({ isOpen, onClose, onSuccess, user }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    } else {
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (user) {
        await api.put(`/users/${user.id}`, {
          name,
          email,
          is_admin: user.is_admin,
          password: password || undefined 
        });
        onSuccess();
      }else {
        await api.post('/users', { name, email, password });
        onSuccess();
      }

    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert("Erro ao salvar usuário");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Usuário"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>{user ? 'Editar Usuário' : 'Novo Usuário'}</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!user && (
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button className="button" type="submit">
          {user ? 'Atualizar' : 'Salvar'}
        </button>
      </form>
    </Modal>
  );
}
