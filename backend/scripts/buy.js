const hre = require("hardhat");
const { isForSale } = require("./checkForSale");
const { updateOwnershipAndMetadata } = require("./updateipfs");


async function buyNFT(contractAddress, tokenId, buyerSigner, price) {
    try {
        const contract = await hre.ethers.getContractAt("RealEstateNFT", contractAddress);

        // ✅ Check if NFT is listed for sale
        const listedForSale = await isForSale(contractAddress, tokenId);
        if (!listedForSale) {
            console.log(`❌ NFT (ID: ${tokenId}) is not listed for sale. Aborting purchase.`);
            return;
        }
         // ✅ Generate updated metadata before purchase
         console.log(`🔄 Generating updated metadata on IPFS before purchase...`);
         const newMetadataURI = await updateOwnershipAndMetadata(contractAddress, tokenId, buyerSigner.address);
         if (!newMetadataURI) {
             console.log(`❌ Failed to update metadata. Aborting purchase.`);
             return;
         }

        console.log(`🛒 Buying NFT (ID: ${tokenId}) with ${hre.ethers.formatEther(price)} ETH...`);
       
        
        // ✅ Buyer sends ETH directly to seller via contract function
        const tx = await contract.connect(buyerSigner).buyProperty(tokenId, newMetadataURI, { value: price });
        await tx.wait();

        console.log(`✅ NFT (ID: ${tokenId}) bought by: ${buyerSigner.address} with updated metadata!`);
    } catch (error) {
        console.error("❌ Error purchasing NFT:", error);
    }
}
module.exports = { buyNFT };


// ✅ Execute for local testing
// async function main() {
//     const [old,buyer] = await hre.ethers.getSigners();
//     const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//     const contract = await hre.ethers.getContractAt("RealEstateNFT", contractAddress);
//     const tokenId = 1;
//     const price = hre.ethers.parseEther("2");

//     // ✅ Fetch required price from the contract
//     const property = await contract.properties(tokenId);
//     const requiredPrice = property.price;
// console.log(`🔹 Required Price (Wei): ${requiredPrice.toString()} Wei`);
// console.log(`🔹 Required Price (ETH): ${hre.ethers.formatEther(requiredPrice)} ETH`);
// console.log(`🔹 Transaction Value Sent: ${hre.ethers.formatEther(price)} ETH`);

    
//     // ✅ Call buyNFT function
//     await buyNFT(contractAddress, tokenId, buyer, price);
// }


// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });
