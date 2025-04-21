require("dotenv").config();

// ✅ Fetch NFT Metadata Function
async function getNFTMetadata(contract, tokenId) {
    try {
        console.log(`📡 Fetching tokenURI for NFT ID: ${tokenId} from contract: ${await contract.getAddress()}`);

        // ✅ Fetch tokenURI from the contract
        const tokenURI = await contract.tokenURI(tokenId);

        if (!tokenURI || tokenURI === "") {
            console.log(`❌ No tokenURI found for Token ID: ${tokenId}. NFT might not exist.`);
            return null;
        }

        const ipfsGatewayURL = `https://ipfs.io/ipfs/${tokenURI.replace("ipfs://", "")}`;
        console.log(`🌍 Fetching metadata from: ${ipfsGatewayURL}`);

        // ✅ Fetch metadata using `fetch()`
        const response = await fetch(ipfsGatewayURL);

        if (!response.ok) {
            console.error(`❌ Error fetching IPFS data: HTTP ${response.status}`);
            return null;
        }

        const metadata = await response.json();
        console.log(`✅ Metadata fetched successfully!`);
        return metadata; // ✅ Return full JSON metadata
    } catch (error) {
        console.error("❌ Error fetching NFT metadata:", error.message);
        return null;
    }
}

// ✅ Export function
module.exports = { getNFTMetadata };

// async function fetchPropertyDetails(propertyURL) {
//     try {
//         const response = await fetch(`https://ipfs.io/ipfs/${propertyURL.replace("ipfs://", "")}`);
//         const details = await response.json();
//         return details;
//     } catch (error) {
//         console.error("❌ Error fetching property details:", error);
//         return null;
//     }
// }

// async function fetchOwnershipHistory(ownershipURL) {
//     try {
//         const response = await fetch(`https://ipfs.io/ipfs/${ownershipURL.replace("ipfs://", "")}`);
//         const ownership = await response.json();
//         return ownership;
//     } catch (error) {
//         console.error("❌ Error fetching ownership history:", error);
//         return null;
//     }
// }

// // ✅ Fetch NFT Metadata first, then fetch additional details
// async function fetchFullNFTDetails(contractAddress, tokenId) {
//     try {
//         const metadata = await getNFTMetadata(contractAddress, tokenId);
//         console.log(metadata);
//         if (!metadata) return null;

//         const propertyURL = metadata.attributes.find(attr => attr.trait_type === "Property Details")?.value;
//         const ownershipURL = metadata.attributes.find(attr => attr.trait_type === "Past Ownership")?.value;
        
//         // Fetch additional details only if URLs exist
//         const propertyDetails = propertyURL ? await fetchPropertyDetails(propertyURL) : null;
//         const ownershipHistory = ownershipURL ? await fetchOwnershipHistory(ownershipURL) : null;

//         console.log("✅ Final NFT Data:", JSON.stringify({ metadata, propertyDetails, ownershipHistory }, null, 2));
//         return { metadata, propertyDetails, ownershipHistory };
//     } catch (error) {
//         console.error("❌ Error fetching full NFT details:", error);
//         return null;
//     }
// }

// // ✅ Export functions for backend integration

// async function main() {
//     const [owner, old, buyer] = await hre.ethers.getSigners();
//     const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Change for Sepolia
//     const tokenId = 1;
//     const price = hre.ethers.parseEther("2");
    
//     const link =await getNFTMetadata(contractAddress, tokenId);
//     console.log(link);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });