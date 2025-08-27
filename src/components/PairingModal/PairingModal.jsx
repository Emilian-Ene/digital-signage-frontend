// src/components/PairingModal/PairingModal.jsx

import React, { useState, useRef, useEffect } from 'react';
import Modal from '../Modal/Modal'; // Use our custom modal
import styles from './PairingModal.module.css';
import DeviceCard from '../DeviceCard/DeviceCard';
import InstructionsModal from '../InstructionsModal/InstructionsModal';
import { FaAndroid, FaWindows, FaTimes } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3000/api';

const PairingModal = ({ isOpen, onRequestClose }) => {
  const [instructionType, setInstructionType] = useState(null);
  const [screenName, setScreenName] = useState('');
  const [pinCode, setPinCode] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setScreenName('');
      setPinCode(Array(6).fill(""));
      setInstructionType(null);
    }
  }, [isOpen]);

  const handlePinChange = (e, index) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]$/.test(value) || value === "") {
      const newPinCode = [...pinCode];
      newPinCode[index] = value;
      setPinCode(newPinCode);
      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pinCode[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePairScreen = async () => {
    const pairingCode = pinCode.join('');
    if (!screenName) {
      alert("Please enter a name for your screen.");
      return;
    }
    if (pairingCode.length !== 6) {
      alert("Please enter a valid 6-character pairing code.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/players/pair`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: screenName, pairingCode: pairingCode }),
      });
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Pairing failed.');
      }
      alert('Screen paired successfully!');
      onRequestClose(true);
    } catch (error) {
      console.error("Pairing Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onRequestClose(false)}>
        <div className={styles.modal}>
          <button onClick={() => onRequestClose(false)} className={styles.closeButton}>
            <FaTimes size={20} />
          </button>
          <div className={styles.content}>
            <h2 className={styles.title}>Enter Pairing Code</h2>
            <input 
              type="text" 
              placeholder="Enter Screen Name Here" 
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              className={styles.nameInput}
            />
            <div className={styles.codeInputContainer}>
              {pinCode.map((digit, index) => (
                <input 
                  key={index} 
                  ref={el => inputRefs.current[index] = el}
                  type="text" 
                  maxLength="1" 
                  value={digit}
                  onChange={(e) => handlePinChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={styles.codeInput} 
                />
              ))}
            </div>
            <p className={styles.subtitle}>Or scan the QR code displayed on your device to pair your screen.</p>
            <button onClick={handlePairScreen} className={styles.pairButton}>Pair screen</button>
            <div className={styles.divider}>
              <span>Don't have a pairing code?</span>
            </div>
            <h3 className={styles.title}>What kind of device do you have?</h3>
            <div className={styles.deviceGrid}>
              <DeviceCard 
                Icon={FaAndroid} 
                title="Android player" 
                onClick={() => setInstructionType('android')}
              />
              <DeviceCard 
                Icon={FaWindows} 
                title="Windows Player" 
                onClick={() => setInstructionType('windows')}
              />
            </div>
          </div>
        </div>
      </Modal>

      <InstructionsModal 
        isOpen={!!instructionType}
        onRequestClose={() => setInstructionType(null)}
        deviceType={instructionType}
      />
    </>
  );
};

export default PairingModal;