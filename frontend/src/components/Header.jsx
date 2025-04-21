import React from 'react';
import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import './Header.css'; // Custom styling

// Loader while model is loading
function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)}% Loaded</Html>;
}

// 3D Model Component
function Model() {
  const materials = useLoader(MTLLoader, "/models/building_04.mtl");
  const obj = useLoader(OBJLoader, "/models/building_04.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
    }
  });

  return <primitive ref={ref} object={obj} scale={1} position={[0, -1, 0]} />;
}

const Header = () => {
  return (
    <div className="header-section text-white bg-dark">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent px-5 py-3">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-4 text-warning" href="#">
            <em>PropVR</em>
          </a>
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav mb-2 mb-lg-0 gap-4">
              <li className="nav-item">
                <a className="nav-link" href="#work">Projects</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="d-none d-lg-block">
            <a href="#talk" className="btn btn-outline-warning rounded-pill px-4">
              Book a Virtual Tour
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap px-5 py-5" style={{ minHeight: '90vh' }}>
        <div className="col-lg-6 text-start">
          <h1 className="display-3 fw-bold text-warning">India's Smart<br />Real Estate Hub</h1>
          <p className="lead text-light mt-4">
            Discover, explore, and own premium properties across India with immersive virtual tours and secure blockchain-backed transactions.
          </p>
          <p className="text-warning small mt-2">contact@yourdomain.com</p>
        </div>

        <div className="col-lg-5 d-flex justify-content-center mt-4 mt-lg-0">
          <div className="w-full h-[500px] md:w-1/2">
            <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
              <ambientLight intensity={1} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Suspense fallback={<Loader />}>
                <Model />
              </Suspense>
              <OrbitControls />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
