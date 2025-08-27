// src/components/DeviceCard/DeviceCard.jsx
import styles from './DeviceCard.module.css';

const DeviceCard = ({ Icon, title, onClick }) => {
  return (
    <button className={styles.card} onClick={onClick}>
      <Icon size={40} />
      <span className={styles.title}>{title}</span>
    </button>
  );
};

export default DeviceCard;