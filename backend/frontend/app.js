const connectWalletBtn = document.getElementById("connectWallet");
const userWalletSpan = document.getElementById("userWallet");
const listNFTBtn = document.getElementById("listNFT");
const delistNFTBtn = document.getElementById("delistNFT");
const buyNFTBtn = document.getElementById("buyNFT");
const checkOwnersBtn = document.getElementById("checkOwners");
const checkSaleBtn = document.getElementById("checkSale");
const fetchMetadataBtn = document.getElementById("fetchMetadata");
const statusMessage = document.getElementById("statusMessage");

let userAddress = null; // Store connected wallet address

// ✅ Connect Wallet Function
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            userAddress = accounts[0];
            userWalletSpan.innerText = userAddress;
            console.log("🔗 Wallet Connected:", userAddress);
        } catch (error) {
            console.error("❌ Wallet connection failed:", error);
            alert("Wallet connection was rejected!");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// ✅ Fetch NFT Metadata
async function fetchMetadata() {
    const tokenId = document.getElementById("tokenId").value;
    if (!tokenId) return alert("Enter a Token ID!");

    statusMessage.innerText = "📡 Fetching Metadata...";
    const response = await fetch(`http://localhost:5500/fetchNFT/${tokenId}`);
    const data = await response.json();
    statusMessage.innerText = JSON.stringify(data.nftData, null, 2);
}

// ✅ List NFT
async function listNFT() {
    const tokenId = document.getElementById("tokenId").value;
    const price = document.getElementById("price").value;
    if (!tokenId || !price || !userAddress) return alert("Enter Token ID & Price, and connect your wallet!");

    statusMessage.innerText = "📤 Listing NFT...";
    const response = await fetch("http://localhost:5500/listNFT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, price, ownerAddress: userAddress })
    });

    const data = await response.json();
    statusMessage.innerText = data.message;
}

// ✅ Delist NFT
async function delistNFT() {
    const tokenId = document.getElementById("tokenId").value;
    if (!tokenId || !userAddress) return alert("Enter Token ID and connect your wallet!");

    statusMessage.innerText = "⛔ Delisting NFT...";
    const response = await fetch("http://localhost:5500/delistNFT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, ownerAddress: userAddress })
    });

    const data = await response.json();
    statusMessage.innerText = data.message;
}

// ✅ Buy NFT
async function buyNFT() {
    const tokenId = document.getElementById("tokenId").value;
    const price = document.getElementById("price").value;
    if (!tokenId || !price || !userAddress) return alert("Enter Token ID, Price, and connect your wallet!");

    statusMessage.innerText = "🛒 Purchasing NFT...";
    const response = await fetch("http://localhost:5500/buyNFT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, price, buyerAddress: userAddress })
    });

    const data = await response.json();
    statusMessage.innerText = data.message;
}

// ✅ Check Past Owners
async function checkOwners() {
    const tokenId = document.getElementById("tokenId").value;
    if (!tokenId) return alert("Enter a Token ID!");

    statusMessage.innerText = "🔍 Fetching Past Owners...";
    const response = await fetch(`http://localhost:5500/getPastOwners/${tokenId}`);
    const data = await response.json();
    statusMessage.innerText = JSON.stringify(data.owners, null, 2);
}

// ✅ Check if NFT is For Sale
async function checkSale() {
    const tokenId = document.getElementById("tokenId").value;
    if (!tokenId) return alert("Enter a Token ID!");

    statusMessage.innerText = "🔎 Checking Sale Status...";
    const response = await fetch(`http://localhost:5500/isForSale/${tokenId}`);
    const data = await response.json();
    statusMessage.innerText = data.isForSale ? "✅ NFT is For Sale!" : "❌ NFT is NOT for Sale!";
}

// ✅ Event Listeners
connectWalletBtn.addEventListener("click", connectWallet);
fetchMetadataBtn.addEventListener("click", fetchMetadata);
listNFTBtn.addEventListener("click", listNFT);
delistNFTBtn.addEventListener("click", delistNFT);
buyNFTBtn.addEventListener("click", buyNFT);
checkOwnersBtn.addEventListener("click", checkOwners);
checkSaleBtn.addEventListener("click", checkSale);
