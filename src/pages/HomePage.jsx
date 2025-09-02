import React, { useState } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import PairingModal from '../components/PairingModal/PairingModal';
import Modal from '../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { FiDownload, FiGrid, FiPlusCircle } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';

const instructionSteps = {
  android: [
    { title: '1. INSTALL OUR APP', text: 'Search for "PixelFlow" on Google Play.' },
    { title: '2. OPEN THE APP', text: 'You will see a pairing code displayed on the screen.' },
    { title: '3. PAIR YOUR SCREEN', text: 'Enter the pairing code displayed on your Android device.' },
  ],
  windows: [
    { title: '1. DOWNLOAD THE APP', text: 'Get the Windows installer from our website.' },
    { title: '2. RUN THE INSTALLER', text: 'Follow the on-screen instructions to install the player.' },
    { title: '3. LAUNCH & PAIR', text: 'Open the app and enter the pairing code shown on the screen.' },
  ]
};

const HomePage = ({ isMobile }) => {
  const [isPairingModalOpen, setPairingModalOpen] = useState(false);
  const [isInstructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [deviceType, setDeviceType] = useState('');
  const navigate = useNavigate();

  const handleActionComplete = () => {
    setPairingModalOpen(false);
    navigate('/screens');
  };

  const headerActions = (
    <>
      <button onClick={() => setPairingModalOpen(true)} className="btn btn-primary">+ New screen</button>
      
      {/* These buttons will only show on wider screens */}
      {!isMobile && (
        <>
          <button className="btn btn-light">Create emulator</button>
          <button className="btn btn-light">Republish content</button>
        </>
      )}
    </>
  );

  const handleOpenInstructions = (type) => {
    setDeviceType(type);
    setInstructionsModalOpen(true);
  };

  const steps = instructionSteps[deviceType] || [];

  return (
    <div className="page-container">
      <MainHeader actions={headerActions} />
      
      <div className={styles.container}>
        <h2 className={styles.title}>How to connect your screens with PixelFlow?</h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <FiDownload className={styles.icon} />
            <h3 className={styles.cardTitle}>Download the PixelFlow App</h3>
            <div className={styles.instructionButtons}>
                <button onClick={() => handleOpenInstructions('android')} className="btn-light">Android</button>
                <button onClick={() => handleOpenInstructions('windows')} className="btn-light">Windows</button>
            </div>
          </div>
          <div className={styles.card}>
            <FiGrid className={styles.icon} />
            <h3 className={styles.cardTitle}>Launch the App and you will see</h3>
            <p className={styles.cardSubtitle}>a pin code</p>
          </div>
          <div className={styles.card}>
            <FiPlusCircle className={styles.icon} />
            <h3 className={styles.cardTitle}>Click the 'New Screen' button</h3>
            <p className={styles.cardSubtitle}>and enter the pin code</p>
          </div>
        </div>
      </div>

      <PairingModal 
        isOpen={isPairingModalOpen}
        onRequestClose={() => setPairingModalOpen(false)}
        onActionComplete={handleActionComplete} 
      />

      <Modal isOpen={isInstructionsModalOpen} onClose={() => setInstructionsModalOpen(false)}>
        <div className={styles.modal}>
          <button onClick={() => setInstructionsModalOpen(false)} className={styles.closeButton}>
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

    </div>
  );
};

export default HomePage;