import React from 'react';

function ConfirmationModal({ showModal, onClose, onConfirm, taskName, confirmationMessage }) {
  if (!showModal) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{confirmationMessage}</h2>
        <p className='taskName'> Task: {taskName}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">Yes</button>
          <button onClick={onClose} className="cancel-button">No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
