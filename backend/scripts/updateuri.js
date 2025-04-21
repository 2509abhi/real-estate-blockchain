const hre = require("hardhat");
require("dotenv").config();

async function updateMetadata(contractAddress, tokenId, newMetadataURI, ownerSigner) {
    try {
        const contract = await hre.ethers.getContractAt("RealEstateNFT", contractAddress);
        
        console.log(`🔄 Updating metadata for NFT ID: ${tokenId}...`);
        
        // ✅ Ensure only the contract owner can update metadata
        const tx = await contract.connect(ownerSigner).updateMetadata(tokenId, newMetadataURI);
        await tx.wait();
        
        console.log(`✅ Metadata updated successfully! New Metadata URI: ${newMetadataURI}`);
    } catch (error) {
        console.error("❌ Error updating metadata:", error);
    }
}

// ✅ Dynamic execution for backend integration
// async function main() {
//     const [owner] = await hre.ethers.getSigners();
//     const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Change this to your deployed contract address
//     const tokenId = 1;
//     const newMetadataURI = "ipfs://bafkreihjrsq5mar364prlsftzkkmco3p3rsyckb254phheazgzkn26bybe"; // ✅ Replace with the actual new metadata URI

//     await updateMetadata(contractAddress, tokenId, newMetadataURI, owner);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });

// ✅ Export function
module.exports = { updateMetadata };
