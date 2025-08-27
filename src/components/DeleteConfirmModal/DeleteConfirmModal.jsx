// src/components/DeleteConfirmModal/DeleteConfirmModal.jsx
import React from 'react';
import Modal from '../Modal/Modal'; // <-- Check this import path
import styles from './DeleteConfirmModal.module.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, screenName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modal}>
        <h3 className={styles.modalText}>
          Are you sure about deleting {screenName}?
        </h3>
        <div className={styles.actions}>
          <button onClick={onClose} className={`${styles.btn} ${styles.cancelBtn}`}>
            Cancel
          </button>
          <button onClick={onConfirm} className={`${styles.btn} ${styles.deleteBtn}`}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;