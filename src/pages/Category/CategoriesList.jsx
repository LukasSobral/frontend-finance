import { useEffect, useState } from 'react';
import api from '../../services/api';
import ModalCategory from '../../components/ModalCategory/ModalCategory';
import ModalConfirmDelete from '../../components/ModalConfirmDelete/ModalConfirmDelete';
import './CategoriesList.css';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${categoryToDelete.id}`);
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>Categorias</h1>
        <button
          className="button highlight"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          ➕ Nova Categoria
        </button>
      </div>

      <div className="categories-list">
        {categories.map((c) => (
          <div key={c.id} className="category-card">
            <div className="category-icon">{c.name.charAt(0).toUpperCase()}</div>

            <div className="category-info">
              <strong>{c.name}</strong>
              {c.description && <small>{c.description}</small>}
            </div>

            <div className="category-actions">
              <button className="btn-editar" onClick={() => handleEdit(c)}>Editar</button>
              <button
                className="btn-excluir"
                onClick={() => {
                  setCategoryToDelete(c);
                  setIsConfirmOpen(true);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModalCategory
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategories}
        category={editingCategory}
      />

      <ModalConfirmDelete
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        itemName={categoryToDelete?.name}
      />
    </div>
  );
}
