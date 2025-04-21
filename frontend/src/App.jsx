import React, { useState } from 'react';
import Header from './components/Header';
import ApartmentList from './components/ApartmentList';
import ApartmentModal from './components/ApartmentModal';
import NFTMarketplace from './components/NFTMarketplace';
import Footer from './components/Footer';
import "./App.css"
const App = () => {
  const [selectedApartment, setSelectedApartment] = useState(null);

  const handleApartmentClick = (apartment) => {
    setSelectedApartment(apartment);
  };

  const closeModal = () => {
    setSelectedApartment(null);
  };

  return (
    
      <div style={{ padding: '20px', backgroundColor: '#222', color: 'white' }}>
        <Header />
        <ApartmentList onApartmentClick={handleApartmentClick} />
        {selectedApartment && (
          <ApartmentModal apartment={selectedApartment} onClose={closeModal} />
        )}
        <Footer />
      </div>
  );
};

export default App;
