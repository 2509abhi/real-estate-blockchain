import React from 'react';
import UnityApp from './UnityApp';
import BlockchainInterface from './BlockchainInterface';
import './ApartmentModal.css';
import NFTMarketplace from './NFTMarketplace';

const ApartmentModal = ({ apartment, onClose }) => {
  const { title, description, unityConfig } = apartment;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>X</button>
        <h2>{title}</h2>
        <p>{description}</p>

        <div className="modal-section">
          {unityConfig ? (
            <UnityApp unityConfig={unityConfig} />
          ) : (
            <p>Model is not present. Stay tuned! We are working on entering the meta world.</p>
          )}
        </div>

        <div className="modal-section">
          <BlockchainInterface apartmentId={apartment.id} />
          <NFTMarketplace />
        </div>
      </div>
    </div>
  );
};

export default ApartmentModal;
