require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5500;

// ✅ Import NFT functions
const {
    purchaseNFT,
    listNFTForSale,
    delistNFTFromSale,
    checkIfForSale,
    fetchNFTMetadata,
    fetchPastOwners
} = require("./scripts/Nft_handler");

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Fetch NFT Metadata
app.get("/fetchNFT/:tokenId", async (req, res) => {
    const { tokenId } = req.params;
    console.log(`📡 Fetching NFT Metadata for Token ID: ${tokenId}`);

    try {
        const metadata = await fetchNFTMetadata(tokenId);
        if (!metadata) {
            return res.status(404).json({ message: "❌ NFT metadata not found" });
        }
        res.json({ metadata });
    } catch (error) {
        console.error("❌ Error fetching NFT metadata:", error);
        res.status(500).json({ message: "❌ Internal server error" });
    }
});

// ✅ List NFT for Sale
app.post("/listNFT", async (req, res) => {
    const { tokenId, price } = req.body;
    
    try {
        const provider = new ethers.BrowserProvider(window.ethereum); // ✅ Use Metamask provider
        const result = await listNFTForSale(provider, tokenId, price);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Failed to list NFT." });
    }
});

// ✅ Delist NFT
app.post("/delistNFT", async (req, res) => {
    const { tokenId } = req.body;
    console.log(`📤 Delisting NFT ID: ${tokenId}...`);

    try {
        const result = await delistNFTFromSale(tokenId);
        res.json(result);
    } catch (error) {
        console.error("❌ Error delisting NFT:", error);
        res.status(500).json({ message: "❌ Failed to delist NFT" });
    }
});

// ✅ Purchase NFT
app.post("/purchaseNFT", async (req, res) => {
    const { tokenId, buyerAddress, price } = req.body;
    console.log(`🛒 Buying NFT ID: ${tokenId} for ${price} ETH by ${buyerAddress}...`);

    try {
        const result = await purchaseNFT(tokenId, buyerAddress, price);
        res.json(result);
    } catch (error) {
        console.error("❌ Error purchasing NFT:", error);
        res.status(500).json({ message: "❌ Failed to purchase NFT" });
    }
});

// ✅ Check If NFT is Listed for Sale
app.get("/isForSale/:tokenId", async (req, res) => {
    const { tokenId } = req.params;
    console.log(`🔍 Checking if NFT ID: ${tokenId} is for sale...`);

    try {
        const isListed = await checkIfForSale(tokenId);
        res.json({ tokenId, isForSale: isListed });
    } catch (error) {
        console.error("❌ Error checking sale status:", error);
        res.status(500).json({ message: "❌ Failed to check sale status" });
    }
});

// ✅ Fetch Past Owners
app.get("/fetchPastOwners/:tokenId", async (req, res) => {
    const { tokenId } = req.params;
    console.log(`📜 Fetching past owners for NFT ID: ${tokenId}...`);

    try {
        const owners = await fetchPastOwners(tokenId);
        res.json({ tokenId, pastOwners: owners });
    } catch (error) {
        console.error("❌ Error fetching past owners:", error);
        res.status(500).json({ message: "❌ Failed to fetch past owners" });
    }
});

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
