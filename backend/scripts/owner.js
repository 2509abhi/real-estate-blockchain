const hre = require("hardhat");

// ✅ Fetch Last 3 Owners Function
async function getLastOwners(contractAddress, tokenId) {
    try {
        const contract = await hre.ethers.getContractAt("RealEstateNFT", contractAddress);
        const owners = await contract.getLastOwners(tokenId);
        // console.log("✅ Last 3 Owners:", owners);
        return owners;
    } catch (error) {
        console.error("❌ Error fetching last owners:", error);
        return null;
    }
}

// ✅ Export function for backend integration
module.exports = { getLastOwners };


// async function main() {
//     const [owner, old, buyer] = await hre.ethers.getSigners();
//     const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Change for Sepolia
//     const tokenId = 1;
//     const price = hre.ethers.parseEther("2");
    
//     await getLastOwners(contractAddress, tokenId);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });