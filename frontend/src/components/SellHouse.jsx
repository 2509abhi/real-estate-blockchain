import React, { useState } from 'react';
import './SellHouse.css'; // style it as needed

const SellHouseForm = ({ onPricePredict }) => {
  const [formData, setFormData] = useState({
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    location: '',
    yearBuilt: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5500/api/predict-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    onPricePredict(data.predictedPrice);
  };

  return (
    <form className="sell-house-form" onSubmit={handleSubmit}>
      <h2>Sell Your House</h2>
      <input name="bedrooms" type="number" placeholder="Bedrooms" onChange={handleChange} required />
      <input name="bathrooms" type="number" placeholder="Bathrooms" onChange={handleChange} required />
      <input name="sqft" type="number" placeholder="Square Footage" onChange={handleChange} required />
      <input name="location" type="text" placeholder="Location (City or ZIP)" onChange={handleChange} required />
      <input name="yearBuilt" type="number" placeholder="Year Built" onChange={handleChange} required />
      <button type="submit">Predict Price</button>
    </form>
  );
};

export default SellHouseForm;
