const hre = require("hardhat");
const { isForSale } = require("./checkForSale"); // ✅ Import checkForSale function

// ✅ Delist NFT Function
async function delistNFT(contractAddress, tokenId, signer) {
    try {
        const contract = await hre.ethers.getContractAt("RealEstateNFT", contractAddress);

        // ✅ Check if NFT is actually listed for sale before attempting to delist
        const listedForSale = await isForSale(contractAddress, tokenId);
        if (!listedForSale) {
            console.log(`❌ NFT (ID: ${tokenId}) is not listed for sale.`);
            return { success: false, message: "NFT is not listed for sale." };
        }

        // ✅ Fetch the current owner of the NFT
        const currentOwner = await contract.ownerOf(tokenId);
        console.log(`✅ Current Owner of NFT ${tokenId}: ${currentOwner}`);

        // ✅ Ensure only the owner can delist it
        if (currentOwner.toLowerCase() !== signer.address.toLowerCase()) {
            console.log("❌ You are not the owner of this NFT. Cannot delist.");
            return { success: false, message: "Only the NFT owner can delist it." };
        }

        // ✅ Proceed with delisting
        const tx = await contract.connect(signer).delistProperty(tokenId);
        await tx.wait();

        console.log(`✅ NFT (ID: ${tokenId}) has been delisted by: ${signer.address}`);
        return { success: true, message: `NFT (ID: ${tokenId}) has been delisted.` };
    } catch (error) {
        console.error("❌ Error delisting NFT:", error);
        return { success: false, message: "Failed to delist NFT." };
    }
}

// ✅ Export function for backend integration
module.exports = { delistNFT };



// async function main() {
//     const [ buyer] = await hre.ethers.getSigners();
//     const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Change for Sepolia
//     const tokenId = 1;
//     const price = hre.ethers.parseEther("2");
    
//     await delistNFT(contractAddress, tokenId, buyer);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });