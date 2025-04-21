import React, { useState } from 'react';
import './NFTMarketplace.css'; // custom CSS

const NFTMarketplace = () => {
  // ------------------ States ------------------
  const [userAddress, setUserAddress] = useState(null);
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const [statusMessage, setStatusMessage] = useState('Not Connected');

  // ------------------ Handlers ------------------
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
        setStatusMessage(`Wallet connected: ${accounts[0]}`);
      } catch (error) {
        console.error("❌ Wallet connection failed:", error);
        alert("Wallet connection was rejected!");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleFetchMetadata = async () => {
    if (!tokenId) return alert("Enter a Token ID!");

    setStatusMessage("📡 Fetching Metadata...");
    try {
      const response = await fetch(`http://localhost:5500/fetchNFT/${tokenId}`);
      const data = await response.json();
      setStatusMessage(JSON.stringify(data.nftData, null, 2));
    } catch (error) {
      console.error(error);
      setStatusMessage("Error fetching metadata.");
    }
  };

  const handleListNFT = async () => {
    if (!tokenId || !price || !userAddress) {
      return alert("Enter Token ID & Price, and connect your wallet!");
    }

    setStatusMessage("📤 Listing NFT...");
    try {
      const response = await fetch("http://localhost:5500/listNFT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, price, ownerAddress: userAddress }),
      });
      const data = await response.json();
      setStatusMessage(data.message);
    } catch (error) {
      console.error(error);
      setStatusMessage("Error listing NFT.");
    }
  };

  const handleDelistNFT = async () => {
    if (!tokenId || !userAddress) {
      return alert("Enter Token ID and connect your wallet!");
    }

    setStatusMessage("⛔ Delisting NFT...");
    try {
      const response = await fetch("http://localhost:5500/delistNFT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, ownerAddress: userAddress }),
      });
      const data = await response.json();
      setStatusMessage(data.message);
    } catch (error) {
      console.error(error);
      setStatusMessage("Error delisting NFT.");
    }
  };

  const handleBuyNFT = async () => {
    if (!tokenId || !price || !userAddress) {
      return alert("Enter Token ID, Price, and connect your wallet!");
    }

    setStatusMessage("🛒 Purchasing NFT...");
    try {
      const response = await fetch("http://localhost:5500/buyNFT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, price, buyerAddress: userAddress }),
      });
      const data = await response.json();
      setStatusMessage(data.message);
    } catch (error) {
      console.error(error);
      setStatusMessage("Error buying NFT.");
    }
  };

  const handleCheckOwners = async () => {
    if (!tokenId) return alert("Enter a Token ID!");

    setStatusMessage("🔍 Fetching Past Owners...");
    try {
      const response = await fetch(`http://localhost:5500/getPastOwners/${tokenId}`);
      const data = await response.json();
      setStatusMessage(JSON.stringify(data.owners, null, 2));
    } catch (error) {
      console.error(error);
      setStatusMessage("Error fetching past owners.");
    }
  };

  const handleCheckSale = async () => {
    if (!tokenId) return alert("Enter a Token ID!");

    setStatusMessage("🔎 Checking Sale Status...");
    try {
      const response = await fetch(`http://localhost:5500/isForSale/${tokenId}`);
      const data = await response.json();
      setStatusMessage(data.isForSale ? "✅ NFT is For Sale!" : "❌ NFT is NOT for Sale!");
    } catch (error) {
      console.error(error);
      setStatusMessage("Error checking sale status.");
    }
  };

  // ------------------ Render ------------------
  return (
    <div className="header-section text-white bg-dark">
    <div className="marketplace-container">
      <h2>NFT Marketplace</h2>
      <button className="connect-btn" onClick={connectWallet}>🔗 Connect Wallet</button>

      <div className="wallet-info">
        <p><strong>Wallet Address:</strong> {userAddress || "Not Connected"}</p>
      </div>

      <div className="form-section">
        <label htmlFor="tokenId">NFT Token ID:</label>
        <input
          type="number"
          id="tokenId"
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />

        <label htmlFor="price">Price (ETH) [For Listing & Buying]:</label>
        <input
          type="number"
          id="price"
          placeholder="Enter Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="button-group">
          <button onClick={handleFetchMetadata}>📜 Fetch Metadata</button>
          <button onClick={handleListNFT}>✅ List NFT</button>
          <button onClick={handleDelistNFT}>❌ Delist NFT</button>
          <button onClick={handleBuyNFT}>🛒 Buy NFT</button>
          <button onClick={handleCheckOwners}>👥 Past Owners</button>
          <button onClick={handleCheckSale}>🔍 For Sale?</button>
        </div>
      </div>

      <div className="status-box">
        <pre>{statusMessage}</pre>
      </div>
    </div>
    </div>
  );
};

export default NFTMarketplace;
