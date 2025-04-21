import React, { useState, useEffect } from 'react';

/**
 * Automated slide-in carousel that cycles through images with no user controls.
 *
 * Props:
 * - images (array of imported image URLs)
 * - altText (string): alt text for the <img> tag
 * - interval (number): time in ms between image changes (default 3000)
 * - style (object): optional inline styles for the container
 */
const ImageCarousel = ({ images, altText, interval = 3000, style }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slide, setSlide] = useState(false);

  useEffect(() => {
    // Set up an interval to run every 'interval' ms
    const intervalId = setInterval(() => {
      // 1) Immediately switch to the next image
      setCurrentIndex((prev) => (prev + 1) % images.length);
      // 2) Trigger the "slideIn" animation
      setSlide(true);
      // 3) After the animation completes (0.5s), reset the 'slide' state
      setTimeout(() => {
        setSlide(false);
      }, 500);
    }, interval);

    return () => clearInterval(intervalId);
  }, [images, interval]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <img
        src={images[currentIndex]}
        alt={altText}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          animation: slide ? 'slideIn 0.5s ease-in-out' : 'none',
        }}
      />
    </div>
  );
};

export default ImageCarousel;
