const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();

    const RealEstateNFT = await hre.ethers.getContractFactory("RealEstateNFT");
    const contract = await RealEstateNFT.deploy(owner.address);
    await contract.waitForDeployment();

    console.log(`✅ Contract deployed at: ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
