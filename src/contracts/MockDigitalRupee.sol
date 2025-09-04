// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mock Digital Rupee (MDR)
 * @dev ERC-20 token representing a stablecoin pegged to the Indian Rupee
 * This is a mock implementation for the BondAxis hackathon prototype
 */
contract MockDigitalRupee is ERC20, Ownable {
    uint8 private constant DECIMALS = 18;
    uint256 private constant INITIAL_SUPPLY = 1000000000 * 10**DECIMALS; // 1 billion MDR
    
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    
    constructor(address initialOwner) ERC20("Mock Digital Rupee", "MDR") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint new MDR tokens (Admin only - simulates RBI/central bank control)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit Mint(to, amount);
    }
    
    /**
     * @dev Burn MDR tokens from sender's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
        emit Burn(_msgSender(), amount);
    }
    
    /**
     * @dev Get the number of decimals for the token
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
}