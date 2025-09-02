import React, { useState, useRef, useEffect } from 'react';
import Modal from '../Modal/Modal';
import styles from './PairingModal.module.css';
import DeviceCard from '../DeviceCard/DeviceCard';
import { FaAndroid, FaWindows, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:3000/api';

const instructionSteps = {
  android: [
    { title: '1. INSTALL OUR APP', text: 'Search for "PixelFlow" on Google Play.' },
    { title: '2. OPEN THE APP', text: 'You will see a pairing code displayed on the screen.' },
    { title: '3. PAIR YOUR SCREEN', text: 'Enter the pairing code from your Android device.' },
  ],
  windows: [
    { title: '1. DOWNLOAD THE APP', text: 'Get the Windows installer from our website.' },
    { title: '2. RUN THE INSTALLER', text: 'Follow the instructions to install the player.' },
    { title: '3. LAUNCH & PAIR', text: 'Open the app and enter the pairing code.' },
  ]
};

const PairingModal = ({ isOpen, onRequestClose, onActionComplete }) => {
  const [instructionType, setInstructionType] = useState(null);
  const [screenName, setScreenName] = useState('');
  const [pinCode, setPinCode] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
    } else {
      setScreenName('');
      setPinCode(Array(6).fill(""));
      setInstructionType(null);
    }
  }, [isOpen]);

  // ✅ UPDATED: This logic now accepts letters and numbers, like your old version
  const handlePinChange = (e, index) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    const newPinCode = [...pinCode];
    
    // Get the last character to allow overwriting
    const char = value.slice(-1);

    // Allow only single letters (A-Z) or numbers (0-9)
    if (/^[A-Z0-9]$/.test(char) || char === "") {
      newPinCode[index] = char;
      setPinCode(newPinCode);
      if (char !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pinCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // ✅ UPDATED: The paste handler now accepts letters and numbers
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().slice(0, 6);
    if (/^[A-Z0-9]{6}$/.test(pastedData)) {
      const newPinCode = pastedData.split('');
      setPinCode(newPinCode);
      inputRefs.current[5].focus();
    }
  };

  const handlePairScreen = async () => {
    const pairingCode = pinCode.join('');
    if (!screenName) {
      toast.warn("Please enter a name for your screen.");
      return;
    }
    if (pairingCode.length !== 6) {
      toast.warn("Please enter a valid 6-character pairing code.");
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
      
      toast.success('Screen paired successfully!');
      
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (error) {
      console.error("Pairing Error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const steps = instructionSteps[instructionType] || [];

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
                  onPaste={index === 0 ? handlePaste : undefined}
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

      <Modal isOpen={!!instructionType} onClose={() => setInstructionType(null)}>
        <div className={styles.modal}>
          <button onClick={() => setInstructionType(null)} className={styles.closeButton}>
            <FaTimes size={20} />
          </button>
          <h2 className={styles.title}>How to pair {instructionType} device?</h2>
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
    </>
  );
};

export default PairingModal;