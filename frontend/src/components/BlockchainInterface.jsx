import React, { useState } from 'react';
import { ethers } from 'ethers';
import './BlockchainInterface.css';

const BlockchainInterface = ({ apartmentId }) => {
  const [account, setAccount] = useState(null);
  const [txStatus, setTxStatus] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [ensName, setEnsName] = useState(null);
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      // Request user accounts from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setAccount(address);

      // Look up ENS name if it exists
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const name = await provider.lookupAddress(address); // returns ENS name or null
      if (name) {
        setEnsName(name);
      } else {
        setEnsName(null);
      }
    } catch (error) {
      console.error('User denied account access', error);
    }
  };

  const connectWalletConnect = async () => {
    // Placeholder for WalletConnect integration. In production,
    // you would integrate a library such as @walletconnect/web3-provider.
    alert('WalletConnect integration is not implemented yet.');
    // setSelectedWallet('WalletConnect');
  };

  const buyApartment = async () => {
    if (!account) return alert('Please connect a wallet first');
    try {
      setTxStatus('Processing transaction...');
      // Insert your transaction logic here, e.g. contract interaction via ethers.js
      // Example: const tx = await contract.buyApartment(apartmentId, { value: ethers.utils.parseEther("0.1") });
      // await tx.wait();
      setTxStatus('Apartment purchased successfully!');
    } catch (error) {
      console.error('Transaction failed:', error);
      setTxStatus('Transaction failed');
    }
  };

  return (
    <div className="blockchain-interface">
      <h3>Buy Apartment</h3>
      {account ? (
        <div className="connected-info">
          <img
            className="wallet-logo"
            src="/MetaMask-icon-fox.svg"
            alt="MetaMask"
          />
          <p>Connected: {ensName || account}</p>
        </div>
      ) : (
        <div className="wallet-buttons">
          <button className="wallet-btn metamask" onClick={connectMetaMask}>
            <img
              className="wallet-icon"
              src="/MetaMask-icon-fox.svg"
              alt="MetaMask"
            />
            <span>Connect with MetaMask</span>
          </button>
          <button className="wallet-btn walletconnect" onClick={connectWalletConnect}>
            <img
              className="wallet-icon"
              src="https://www.safepal.com/assets/img/brandoverview/logo-blue.svg"
              alt="SafepalConnect"
            />
            <span>Connect with WalletConnect</span>
          </button>
        </div>
      )}
      <button className="purchase-btn" onClick={buyApartment}>
        Purchase for 0.1 ETH
      </button>
      {txStatus && <p className="tx-status">{txStatus}</p>}
    </div>
  );
};

export default BlockchainInterface;
