import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalConfirmDelete from "../ModalConfirmDelete/ModalConfirmDelete";
import ModalUser from "../ModalUser/ModalUser";
import "./UserManagementPanel.css";

export default function UserManagementPanel() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setIsConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Gerenciar Usuários</h2>
        <button
          className="button"
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
        >
          Novo Usuário
        </button>
      </div>

      <div className="users-list">
        {users.map((u) => (
          <div key={u.id} className="user-card">
            <div>
              <strong>{u.name}</strong>
              <small>{u.email}</small>
            </div>
            <div className="user-actions">
              <button
                className={`btn-status ${u.is_active ? "ativo" : "inativo"}`}
                onClick={() => toggleStatus(u.id)}
              >
                {u.is_active ? "Ativo" : "Inativo"}
              </button>
              <button
                className="btn-editar"
                onClick={() => {
                  setEditingUser(u);
                  setIsModalOpen(true);
                }}
              >
                Editar
              </button>
              <button
                className="btn-excluir"
                onClick={() => {
                  setUserToDelete(u);
                  setIsConfirmOpen(true);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Confirmação */}
      <ModalConfirmDelete
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        itemName={userToDelete?.name}
      />

      {/* Modal de Criação/Edição */}
      <ModalUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchUsers();
          setIsModalOpen(false);
        }}
        user={editingUser}
      />
    </div>
  );
}
