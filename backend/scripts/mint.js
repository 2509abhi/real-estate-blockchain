const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual deployed contract address

    const contract = await hre.ethers.getContractAt("RealEstateNFT", contractAddress);

    // Mint NFT
    const metadataURI = "ipfs://bafkreihjrsq5mar364prlsftzkkmco3p3rsyckb254phheazgzkn26bybe";
    const price = hre.ethers.parseEther("1");

    const tx = await contract.connect(owner).mintProperty(metadataURI, price);
    await tx.wait(); // ✅ Ensures minting is complete

    // Fetch the latest minted token ID
    const latestTokenId = await contract.getLatestTokenId(); // ✅ Correct function
    console.log(`✅ NFT Minted with Token ID: ${latestTokenId} and Metadata: ${metadataURI}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
