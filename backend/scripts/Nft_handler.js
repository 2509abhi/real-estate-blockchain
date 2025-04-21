const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// ✅ Load contract ABI and set up provider
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Change for Sepolia if needed
const contractABIPath = path.join(__dirname, "../artifacts/contracts/RealEstateNFT.sol/RealEstateNFT.json");
const contractABI = JSON.parse(fs.readFileSync(contractABIPath)).abi;

// ✅ Provider & Wallet
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractWithSigner = new ethers.Contract(contractAddress, contractABI, wallet);

// ✅ Import external NFT scripts
const { listNFT } = require("./list.js");
const { delistNFT } = require("./delist.js");
const { buyNFT } = require("./buy.js");
const { isForSale } = require("./checkForSale.js");
const { getNFTMetadata } = require("./fetchdet.js");
const { getLastOwners } = require("./owner.js");

// ✅ List NFT for Sale
async function listNFTForSale(provider, tokenId, price) {
    try {
        const signer = await provider.getSigner(); // ✅ Get connected Metamask signer
        const contractWithSigner = new ethers.Contract(contractAddress, contractABI, signer);
        
        return await listNFT(contractWithSigner, tokenId, price, signer);
    } catch (error) {
        return { success: false, message: error.message || "Failed to list NFT." };
    }
}

// ✅ Delist NFT
async function delistNFTFromSale(tokenId) {
    try {
        return await delistNFT(contractWithSigner, tokenId);
    } catch (error) {
        console.error("❌ Error delisting NFT:", error);
        throw error;
    }
}

// ✅ Buy NFT
async function purchaseNFT(tokenId, buyerAddress, price) {
    try {
        return await buyNFT(contractWithSigner, tokenId, buyerAddress, price);
    } catch (error) {
        console.error("❌ Error purchasing NFT:", error);
        throw error;
    }
}

// ✅ Check if NFT is for sale
async function checkIfForSale(tokenId) {
    try {
        return await isForSale(contractWithSigner, tokenId);
    } catch (error) {
        console.error("❌ Error checking if NFT is for sale:", error);
        throw error;
    }
}

// ✅ Fetch NFT Metadata
async function fetchNFTMetadata(tokenId) {
    try {
        return await getNFTMetadata(contractWithSigner, tokenId);
    } catch (error) {
        console.error("❌ Error fetching NFT metadata:", error);
        throw error;
    }
}

// ✅ Fetch Past Owners
async function fetchPastOwners(tokenId) {
    try {
        return await getLastOwners(contractWithSigner, tokenId);
    } catch (error) {
        console.error("❌ Error fetching past owners:", error);
        throw error;
    }
}

// ✅ Export functions
module.exports = {
    listNFTForSale,
    delistNFTFromSale,
    purchaseNFT,
    checkIfForSale,
    fetchNFTMetadata,
    fetchPastOwners
};
