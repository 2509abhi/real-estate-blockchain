import React from 'react';
import './Footer.css'; // Optional: add styles if needed

const Footer = () => {
  return (
    <footer className="bg-dark text-white pb-3 px-5">
      <div className="container-fluid">
        <div className="row justify-content-between align-items-start flex-wrap">
          {/* Brand & Tagline */}
          <div className="col-md-4 mb-4">
            <h4 className="text-warning fw-bold">PropVR</h4>
            <p className="small">
              Transforming property buying in India with cutting-edge VR and secure blockchain transactions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h6 className="text-warning">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#work" className="text-white text-decoration-none">Projects</a></li>
              <li><a href="#about" className="text-white text-decoration-none">About</a></li>
              <li><a href="#contact" className="text-white text-decoration-none">Contact</a></li>
              <li><a href="#talk" className="text-white text-decoration-none">Book a Tour</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h6 className="text-warning">Contact</h6>
            <p className="small mb-1">📍 Mumbai, India</p>
            <p className="small mb-1">📧 contact@yourdomain.com</p>
            <p className="small">📞 +91 98765 43210</p>
          </div>
        </div>

        <hr className="border-top border-secondary" />

        {/* Footer Bottom */}
        <div className="text-center small">
          &copy; {new Date().getFullYear()} PropVR. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
