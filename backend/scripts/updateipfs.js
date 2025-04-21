require("dotenv").config();
const axios = require("axios");
const PinataSDK = require("@pinata/sdk");
const fetchModule = require("./fetchdet.js");
const { getLastOwners } = require("./owner.js"); // ✅ Import past owner retrieval function
const getNFTMetadata = fetchModule.getNFTMetadata;
const hre = require("hardhat");

const pinata = new PinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_KEY
});

// ✅ Upload JSON to IPFS
async function uploadToIPFS(data, fileName) {
    try {
        const res = await pinata.pinJSONToIPFS(data, {
            pinataMetadata: { name: fileName },
            pinataOptions: { cidVersion: 0 }
        });

        console.log(`📤 Uploaded to Pinata: ${fileName} ✅ (CID: ${res.IpfsHash})`);
        return `ipfs://${res.IpfsHash}`;
    } catch (error) {
        console.error(`❌ Error uploading ${fileName} to Pinata:`, error.message);
        return null;
    }
}

// ✅ Update Ownership & Metadata (Now Uses Buyer Address)
async function updateOwnershipAndMetadata(contractAddress, tokenId, buyerAddress) {
    try {
        console.log(`📡 Fetching metadata for Token ID: ${tokenId}...`);
        const metadata = await getNFTMetadata(contractAddress, tokenId);
        if (!metadata) {
            console.error("❌ Failed to fetch metadata.json");
            return null;
        }

        // ✅ Fetch last owners stored on-chain
        const pastOwners = await getLastOwners(contractAddress, tokenId);
        const lastRecordedOwner = pastOwners.length > 0 ? pastOwners[0] : null;
        
        // ✅ Fetch Ownership JSON from Metadata
        const ownershipURI = metadata.attributes.find(attr => attr.trait_type === "Past Ownership")?.value;
        if (!ownershipURI) {
            console.error("❌ Ownership data missing in metadata.json");
            return null;
        }

        console.log("📡 Fetching ownership data...");
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ownershipURI.replace("ipfs://", "")}`);
        const ownershipData = response.data;
        if (!ownershipData) {
            console.error("❌ Failed to fetch ownership.json");
            return null;
        }

        // ✅ Append the buyer to the ownership history
        const newOwner = {
            address: buyerAddress, // ✅ Now correctly appends the buyer's address
            purchaseDate: new Date().toISOString()
        };
        ownershipData.pastOwners.push(newOwner);

        // ✅ Generate Unique File Names
        const ownershipFileName = `ownership_${buyerAddress}.json`;
        const metadataFileName = `metadata_${buyerAddress}.json`;

        // ✅ Upload new ownership.json
        console.log(`📤 Uploading ${ownershipFileName} to Pinata...`);
        const newOwnershipURI = await uploadToIPFS(ownershipData, ownershipFileName);
        if (!newOwnershipURI) {
            console.error("❌ Failed to upload new ownership.json");
            return null;
        }

        // ✅ Update metadata with new ownership URI
        metadata.attributes = metadata.attributes.map(attr =>
            attr.trait_type === "Past Ownership" ? { trait_type: "Past Ownership", value: newOwnershipURI } : attr
        );

        // ✅ Upload new metadata.json
        console.log(`📤 Uploading ${metadataFileName} to Pinata...`);
        const newMetadataURI = await uploadToIPFS(metadata, metadataFileName);
        if (!newMetadataURI) {
            console.error("❌ Failed to upload new metadata.json");
            return null;
        }

        console.log(`✅ Metadata Update Complete! New Metadata URI: ${newMetadataURI}`);
        return newMetadataURI;
    } catch (error) {
        console.error("❌ Error updating metadata:", error);
        return null;
    }
}

// // ✅ Test Function to Run Script
// async function main() {
//     const [buyer] = await hre.ethers.getSigners(); // ✅ Get buyer's address from Hardhat accounts
//     const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Replace with actual contract address
//     const tokenId = 1;

//     const newMetadataURI = await updateOwnershipAndMetadata(contractAddress, tokenId, buyer.address);
//     if (newMetadataURI) {
//         console.log(`🎉 Successfully updated metadata on IPFS! New URI: ${newMetadataURI}`);
//     } else {
//         console.log("❌ Metadata update failed.");
//     }
// }

// // ✅ Run the script for testing
// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });

// ✅ Export function
module.exports = { updateOwnershipAndMetadata };
