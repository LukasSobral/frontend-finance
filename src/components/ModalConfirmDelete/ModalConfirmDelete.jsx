import Modal from 'react-modal';
import './ModalConfirmDelete.css';

Modal.setAppElement('#root');

function ModalConfirmDelete({ isOpen, onClose, onConfirm, itemName = 'item' }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmar Exclusão"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Confirmar Exclusão</h2>
      <p className='text-p'>Tem certeza que deseja excluir <strong>{itemName}</strong>?</p>

      <div className="modal-actions">
        <button className="button danger" onClick={onConfirm}>Confirmar</button>
        <button className="button" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

export default ModalConfirmDelete;
