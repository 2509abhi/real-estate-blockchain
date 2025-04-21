import React, { useState } from 'react';
import Header from './components/Header';
import ApartmentList from './components/ApartmentList';
import ApartmentModal from './components/ApartmentModal';
import NFTMarketplace from './components/NFTMarketplace';
import SellHouseForm from './components/SellHouse';
import Chatbot from './components/ChatBot';
import Footer from './components/Footer';
import "./App.css"

const App = () => {
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);

  const handleApartmentClick = (apartment) => {
    setSelectedApartment(apartment);
  };

  const closeModal = () => {
    setSelectedApartment(null);
  };

  return (
    
      <div style={{ padding: '20px', backgroundColor: '#222', color: 'white' }}>
        <Header />
        <div>
        <SellHouseForm onPricePredict={setPredictedPrice} />
        {predictedPrice && <h3>Estimated Price: Rs. {predictedPrice}/-</h3>}
      </div>
        <ApartmentList onApartmentClick={handleApartmentClick} />
        {selectedApartment && (
          <ApartmentModal apartment={selectedApartment} onClose={closeModal} />
        )}
        <Footer />
        <Chatbot />        
      </div>
  );
};

export default App;
