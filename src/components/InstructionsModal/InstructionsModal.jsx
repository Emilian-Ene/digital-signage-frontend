// src/components/InstructionsModal/InstructionsModal.jsx

import React from 'react';
import Modal from '../Modal/Modal';
import styles from './InstructionsModal.module.css';
import { FaTimes } from 'react-icons/fa'; // <-- THIS LINE WAS MISSING

const instructionSteps = {
  android: [
    { title: '1. INSTALL OUR APP', text: 'Search for "PixelFlow" (without spaces) on Google Play.' },
    { title: '2. OPEN THE APP', text: 'You will see a pairing code displayed on the screen.' },
    { title: '3. PAIR YOUR SCREEN', text: 'Enter the pairing code displayed on your Android device.' },
  ],
  windows: [
    { title: '1. DOWNLOAD THE APP', text: 'Get the Windows installer from our website.' },
    { title: '2. RUN THE INSTALLER', text: 'Follow the on-screen instructions to install the player.' },
    { title: '3. LAUNCH & PAIR', text: 'Open the app and enter the pairing code shown on the screen.' },
  ]
};

const InstructionsModal = ({ isOpen, onRequestClose, deviceType }) => {
  const steps = instructionSteps[deviceType] || [];

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose}>
      <div className={styles.modal}>
        <button onClick={onRequestClose} className={styles.closeButton}>
          <FaTimes size={20} />
        </button>
        <h2 className={styles.title}>How to pair {deviceType} device?</h2>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
        <p className={styles.footerText}>
          Having troubles pairing your screen? <a href="#">Get in touch</a>
        </p>
      </div>
    </Modal>
  );
};

export default InstructionsModal;