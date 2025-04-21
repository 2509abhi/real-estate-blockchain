const { listNFTForSale, delistNFTFromSale, purchaseNFT, checkIfForSale, fetchNFTMetadata, fetchPastOwners } = require("./Nft_handler");

// 🛠 Debugging Functions
async function debug() {
    const tokenId = 1; // Change this for testing
    const price = 1; // Example price in ETH
    const buyerAddress = "0xYourBuyerAddressHere"; // Replace with a real address

    console.log("🔍 Starting Debug Tests...");

    try {
        // console.log("\n📡 Fetching NFT Metadata...");
        // const metadata = await fetchNFTMetadata(tokenId);
        // console.log("✅ NFT Metadata:", metadata);

        // console.log("\n🔍 Checking if NFT is for Sale...");
        // const isForSale = await checkIfForSale(tokenId);
        // console.log(`✅ Is NFT for Sale? ${isForSale ? "Yes" : "No"}`);

        console.log("\n📤 Listing NFT for Sale...");
        const listResult = await listNFTForSale(tokenId, price);
        console.log("✅ List Result:", listResult);

        // console.log("\n🔍 Checking Again if NFT is for Sale...");
        // const isForSaleAfter = await checkIfForSale(tokenId);
        // console.log(`✅ Is NFT for Sale after listing? ${isForSaleAfter ? "Yes" : "No"}`);

        // console.log("\n📜 Fetching Past Owners...");
        // const pastOwners = await fetchPastOwners(tokenId);
        // console.log("✅ Past Owners:", pastOwners);

        // console.log("\n🛒 Purchasing NFT...");
        // const purchaseResult = await purchaseNFT(tokenId, buyerAddress, price);
        // console.log("✅ Purchase Result:", purchaseResult);

        // console.log("\n📤 Delisting NFT...");
        // const delistResult = await delistNFTFromSale(tokenId);
        // console.log("✅ Delist Result:", delistResult);
        
    } catch (error) {
        console.error("❌ Error during debugging:", error);
    }
}

// 🚀 Run the Debugging Script
debug();
