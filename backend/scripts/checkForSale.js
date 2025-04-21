const hre = require("hardhat");

async function isForSale(contract, tokenId) {
    try {
        // ✅ Fetch the NFT property details
        const property = await contract.properties(tokenId);

        console.log(`🔍 Checking NFT ID: ${tokenId} - For Sale: ${property.forSale}`);
        
        return property.forSale; // ✅ Return the actual forSale status
    } catch (error) {
        console.error("❌ Error checking sale status:", error.message);
        return false; // ✅ Return false in case of an error
    }
}

// ✅ Export function for centralized use in nft_handler.js
module.exports = { isForSale };




// async function main() {
//     const [signer] = await hre.ethers.getSigners();
//     const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Change for Sepolia
//     const tokenId = 1;
//     const price = hre.ethers.parseEther("2");
    
//     const status = await isForSale(contractAddress, tokenId, signer, price);
//     console.log(status);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });