const { ethers } = require("ethers");

async function listNFT(contractWithSigner, tokenId, priceInETH, signer) {
    try {
        // ✅ Check ownership
        const currentOwner = await contractWithSigner.ownerOf(tokenId);
        const signerAddress = await signer.getAddress();

        if (signerAddress.toLowerCase() !== currentOwner.toLowerCase()) {
            throw new Error("Not the owner");
        }

        // ✅ List NFT
        const tx = await contractWithSigner.listProperty(tokenId, priceInETH);
        await tx.wait();
        return { success: true, message: "NFT listed successfully." };
    } catch (error) {
        return { success: false, message: error.message || "Failed to list NFT." };
    }
}

module.exports = { listNFT };




// ✅ Run the script for testing
// async function main() {
//     const [owner] = await hre.ethers.getSigners();
//     const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Change for Sepolia
//     const tokenId = 1;
//     const priceInETH = 2; // ✅ Input price in ETH

//     await listNFT(contractAddress, tokenId, priceInETH, owner);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });
