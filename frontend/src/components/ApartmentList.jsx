import React from 'react';
import ImageCarousel from './ImageCarousel';
import "./ApartmentList.css"
// Import your images
import apartment1_1 from '../assets/apartment1_1.jpeg';
import apartment1_2 from '../assets/apartment1_2.jpeg';
import apartment1_3 from '../assets/apartment1_3.jpeg';

import apartment2_1 from '../assets/apartment2_1.jpeg';
import apartment2_2 from '../assets/apartment2_2.jpeg';
import apartment2_3 from '../assets/apartment2_3.jpeg';

import apartment3_1 from '../assets/apartment3_1.jpeg';
import apartment3_2 from '../assets/apartment3_2.jpeg';
import apartment3_3 from '../assets/apartment3_3.jpeg';

const apartments = [
  {
    id: 1,
    title: 'Luxury Apartment',
    images: [apartment1_1, apartment1_2, apartment1_3],
    unityConfig: {
        buildUrl: "Build",
        dataUrl: "Build/Apartment1.data.gz",
        frameworkUrl: "Build/Apartment1.framework.js.gz",
        codeUrl: "Build/Apartment1.wasm.gz",
        productName: "Luxury Apartment Model"
      },
    description: 'A spacious modern apartment with stunning views.'
  },
  {
    id: 2,
    title: 'Cozy Studio',
    images: [apartment2_1, apartment2_2, apartment2_3],
    unityConfig: null,
    description: 'Perfect for singles or couples in the city center.'
  },
  {
    id: 3,
    title: 'Family Home',
    images: [apartment3_1, apartment3_2, apartment3_3],
    unityConfig: {
        buildUrl: "Build",
        dataUrl: "Build/Apartment1.data.gz",
        frameworkUrl: "Build/Apartment1.framework.js.gz",
        codeUrl: "Build/Apartment1.wasm.gz",
        productName: "Luxury Apartment Model"
      },
    description: 'Ideal for families, featuring multiple rooms and a garden.'
  },
];
const ApartmentList = ({ onApartmentClick }) => {
  return (
    <div className="apartment-list-container bg-dark">
      {apartments.map((apt) => (
        <div
          key={apt.id}
          className="apartment-card"
          onClick={() => onApartmentClick(apt)}
        >
          <ImageCarousel
            images={apt.images}
            altText={apt.title}
            interval={3000} // 3 seconds between slides
            className="image-carousel"
          />
          <h2>{apt.title}</h2>
          <p>{apt.description}</p>
        </div>
      ))}
    </div>
  );
};


export default ApartmentList;
