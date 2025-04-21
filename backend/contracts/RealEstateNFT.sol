// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 public royaltyFee = 5;
    address public treasury;

    struct Property {
        bool forSale;
        string metadataURI;
        uint256 price;
        address[3] lastOwners; // Store last 3 owners only
    }

    mapping(uint256 => Property) public properties;

    event PropertyMinted(address indexed owner, uint256 tokenId, string metadataURI);
    event PropertyListed(uint256 indexed tokenId, uint256 price);
    event PropertySold(uint256 indexed tokenId, address indexed buyer, uint256 price, string newMetadataURI);
    event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);

    constructor(address _treasury) ERC721("RealEstateNFT", "RE-NFT") Ownable(msg.sender) {
        treasury = _treasury;
    }

    /**
     * @dev Mint a new property NFT
     * @param metadataURI IPFS link to metadata.json (Links to other JSON files)
     * @param price Initial price
     */
    function mintProperty(string memory metadataURI, uint256 price) public onlyOwner {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, metadataURI);

        properties[newItemId] = Property({
            forSale: false,
            metadataURI: metadataURI,
            price: price,
            lastOwners: [msg.sender, address(0), address(0)]
        });

        emit PropertyMinted(msg.sender, newItemId, metadataURI);
    }

    /**
     * @dev Buy property & update metadata dynamically
     * @param tokenId Token ID
     * @param newMetadataURI Updated IPFS metadata.json
     */
    function buyProperty(uint256 tokenId, string memory newMetadataURI) public payable {
        require(properties[tokenId].forSale, "Property not for sale");
        require(tokenExists(tokenId), "Token does not exist");

        uint256 price = properties[tokenId].price;
        require(msg.value >= price, "Insufficient funds");

        address currentOwner = ownerOf(tokenId);
        require(msg.sender != currentOwner, "Already owned");

        uint256 royaltyAmount = (msg.value * royaltyFee) / 100;
        uint256 sellerAmount = msg.value - royaltyAmount;

        payable(currentOwner).transfer(sellerAmount);
        payable(treasury).transfer(royaltyAmount);

        _transfer(currentOwner, msg.sender, tokenId);
        properties[tokenId].forSale = false;

        // Update last 3 owners on-chain
        properties[tokenId].lastOwners = [msg.sender, properties[tokenId].lastOwners[0], properties[tokenId].lastOwners[1]];

        // Change metadata to reflect new ownership
        properties[tokenId].metadataURI = newMetadataURI;
        _setTokenURI(tokenId, newMetadataURI);

        emit PropertySold(tokenId, msg.sender, price, newMetadataURI);
    }

    /**
     * @dev Fetch price stored on-chain
     */
    function getPropertyPrice(uint256 tokenId) public view returns (uint256) {
        return properties[tokenId].price;
    }

    /**
     * @dev Update metadata after sale
     * @param tokenId Token ID
     * @param newMetadataURI Updated IPFS metadata.json
     */
    function updateMetadata(uint256 tokenId, string memory newMetadataURI) public onlyOwner {
        require(tokenExists(tokenId), "Token does not exist");

        properties[tokenId].metadataURI = newMetadataURI;
        _setTokenURI(tokenId, newMetadataURI);

        emit MetadataUpdated(tokenId, newMetadataURI);
    }

    /**
     * @dev Get last 3 owners stored on-chain
     */
    function getLastOwners(uint256 tokenId) public view returns (address[3] memory) {
        return properties[tokenId].lastOwners;
    }

    /**
     * @dev Check if token exists
     */
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Update Royalty Fee
     */
    function setRoyaltyFee(uint256 _fee) public onlyOwner {
        require(_fee <= 10, "Royalty too high");
        royaltyFee = _fee;
    }
    
    /**
     * @dev List property for sale
     * @param tokenId Token ID
     * @param price Sale price
     */
    function listProperty(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than zero");

        properties[tokenId].forSale = true;
        properties[tokenId].price = price * 1 ether;

        emit PropertyListed(tokenId, price * 1 ether);
    }
    /**
     * @dev Delist property from sale (Only Owner)
     * @param tokenId Token ID
     */
    function delistProperty(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(properties[tokenId].forSale, "Property is not listed for sale");

        properties[tokenId].forSale = false;
        properties[tokenId].price = 0; // Reset price to 0

        emit PropertyListed(tokenId, 0); // Emit event to show it was delisted
    }
    /**
     * @dev Get the latest minted token ID
     */
    function getLatestTokenId() public view returns (uint256) {
        return _tokenIds;
    }
    

}
