// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BondAxis - Decentralized Bond Tokenization & Trading Platform
 * @dev Core contract for tokenizing Indian corporate bonds and providing AMM liquidity
 * Built for the Securities Market Hackathon - Indian Market Focus
 */
contract BondAxis is ERC20, Ownable, ReentrancyGuard {
    
    // ============= STATE VARIABLES =============
    
    IERC20 public immutable mockDigitalRupee; // MDR token contract
    
    // Bond tokenization data
    struct TokenizedBond {
        string isin;           // International Securities Identification Number
        string bondName;       // Human readable bond name
        uint256 totalSupply;   // Total tokenized amount
        uint256 faceValue;     // Face value in MDR
        bool isActive;         // Whether bond is active for trading
        uint256 createdAt;     // Timestamp of tokenization
    }
    
    // AMM Liquidity Pool data
    struct LiquidityPool {
        uint256 reserveBAT;    // BondAxis Token reserves
        uint256 reserveMDR;    // Mock Digital Rupee reserves
        uint256 totalLPTokens; // Total LP tokens issued
        uint256 k;             // Constant product (reserveBAT * reserveMDR)
    }
    
    // User liquidity positions
    mapping(address => uint256) public lpTokenBalances;
    mapping(string => TokenizedBond) public tokenizedBonds;
    
    LiquidityPool public liquidityPool;
    uint256 public constant MINIMUM_LIQUIDITY = 1000; // Prevent division by zero
    uint256 public constant FEE_BASIS_POINTS = 30;    // 0.3% trading fee
    
    // ============= EVENTS =============
    
    event BondTokenized(
        string indexed isin,
        string bondName,
        uint256 totalSupply,
        uint256 timestamp
    );
    
    event LiquidityAdded(
        address indexed provider,
        uint256 amountBAT,
        uint256 amountMDR,
        uint256 lpTokens
    );
    
    event LiquidityRemoved(
        address indexed provider,
        uint256 amountBAT,
        uint256 amountMDR,
        uint256 lpTokens
    );
    
    event TokenSwapped(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    
    // ============= CONSTRUCTOR =============
    
    constructor(
        address _mockDigitalRupee,
        address initialOwner
    ) ERC20("BondAxis Token", "BAT") Ownable(initialOwner) {
        mockDigitalRupee = IERC20(_mockDigitalRupee);
    }
    
    // ============= BOND TOKENIZATION FUNCTIONS =============
    
    /**
     * @dev Tokenize an Indian corporate bond (Admin only)
     * @param isin International Securities Identification Number (e.g., INE002A07935)
     * @param bondName Human readable name (e.g., "Reliance Industries 8.5% 2030")
     * @param totalSupply Total number of tokens to mint for this bond
     */
    function tokenizeBond(
        string calldata isin,
        string calldata bondName,
        uint256 totalSupply
    ) external onlyOwner {
        require(bytes(isin).length > 0, "BondAxis: Invalid ISIN");
        require(totalSupply > 0, "BondAxis: Invalid supply");
        require(!tokenizedBonds[isin].isActive, "BondAxis: Bond already tokenized");
        
        // Store bond information
        tokenizedBonds[isin] = TokenizedBond({
            isin: isin,
            bondName: bondName,
            totalSupply: totalSupply,
            faceValue: totalSupply * 100, // Assume ₹100 face value per token
            isActive: true,
            createdAt: block.timestamp
        });
        
        // Mint BAT tokens to contract owner
        _mint(owner(), totalSupply);
        
        emit BondTokenized(isin, bondName, totalSupply, block.timestamp);
    }
    
    // ============= LIQUIDITY POOL FUNCTIONS =============
    
    /**
     * @dev Add liquidity to the BAT/MDR pool
     * @param amountBAT Amount of BAT tokens to add
     * @param amountMDR Amount of MDR tokens to add
     */
    function addLiquidity(
        uint256 amountBAT,
        uint256 amountMDR
    ) external nonReentrant returns (uint256 lpTokens) {
        require(amountBAT > 0 && amountMDR > 0, "BondAxis: Invalid amounts");
        
        // Transfer tokens to contract
        require(
            this.transferFrom(msg.sender, address(this), amountBAT),
            "BondAxis: BAT transfer failed"
        );
        require(
            mockDigitalRupee.transferFrom(msg.sender, address(this), amountMDR),
            "BondAxis: MDR transfer failed"
        );
        
        // Calculate LP tokens to mint
        if (liquidityPool.totalLPTokens == 0) {
            // First liquidity provision
            lpTokens = sqrt(amountBAT * amountMDR) - MINIMUM_LIQUIDITY;
            lpTokenBalances[address(0)] = MINIMUM_LIQUIDITY; // Lock minimum liquidity
        } else {
            // Subsequent liquidity provisions
            lpTokens = min(
                (amountBAT * liquidityPool.totalLPTokens) / liquidityPool.reserveBAT,
                (amountMDR * liquidityPool.totalLPTokens) / liquidityPool.reserveMDR
            );
        }
        
        require(lpTokens > 0, "BondAxis: Insufficient liquidity minted");
        
        // Update pool state
        liquidityPool.reserveBAT += amountBAT;
        liquidityPool.reserveMDR += amountMDR;
        liquidityPool.totalLPTokens += lpTokens;
        liquidityPool.k = liquidityPool.reserveBAT * liquidityPool.reserveMDR;
        
        // Credit user with LP tokens
        lpTokenBalances[msg.sender] += lpTokens;
        
        emit LiquidityAdded(msg.sender, amountBAT, amountMDR, lpTokens);
    }
    
    /**
     * @dev Swap tokens using constant product AMM formula
     * @param tokenIn Address of input token (BAT or MDR)
     * @param amountIn Amount of input tokens
     */
    function swap(
        address tokenIn,
        uint256 amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "BondAxis: Invalid input amount");
        require(
            tokenIn == address(this) || tokenIn == address(mockDigitalRupee),
            "BondAxis: Invalid token"
        );
        
        bool isBAT = (tokenIn == address(this));
        
        // Calculate output amount with fee
        uint256 amountInWithFee = amountIn * (10000 - FEE_BASIS_POINTS) / 10000;
        
        if (isBAT) {
            // BAT -> MDR
            amountOut = getAmountOut(
                amountInWithFee,
                liquidityPool.reserveBAT,
                liquidityPool.reserveMDR
            );
            
            // Transfer tokens
            require(
                this.transferFrom(msg.sender, address(this), amountIn),
                "BondAxis: BAT transfer failed"
            );
            require(
                mockDigitalRupee.transfer(msg.sender, amountOut),
                "BondAxis: MDR transfer failed"
            );
            
            // Update reserves
            liquidityPool.reserveBAT += amountIn;
            liquidityPool.reserveMDR -= amountOut;
            
        } else {
            // MDR -> BAT
            amountOut = getAmountOut(
                amountInWithFee,
                liquidityPool.reserveMDR,
                liquidityPool.reserveBAT
            );
            
            // Transfer tokens
            require(
                mockDigitalRupee.transferFrom(msg.sender, address(this), amountIn),
                "BondAxis: MDR transfer failed"
            );
            require(
                this.transfer(msg.sender, amountOut),
                "BondAxis: BAT transfer failed"
            );
            
            // Update reserves
            liquidityPool.reserveMDR += amountIn;
            liquidityPool.reserveBAT -= amountOut;
        }
        
        // Update constant product
        liquidityPool.k = liquidityPool.reserveBAT * liquidityPool.reserveMDR;
        
        emit TokenSwapped(
            msg.sender,
            tokenIn,
            isBAT ? address(mockDigitalRupee) : address(this),
            amountIn,
            amountOut
        );
    }
    
    // ============= VIEW FUNCTIONS =============
    
    /**
     * @dev Calculate output amount for a given input (AMM formula)
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0 && reserveIn > 0 && reserveOut > 0, "BondAxis: Invalid reserves");
        
        uint256 numerator = amountIn * reserveOut;
        uint256 denominator = reserveIn + amountIn;
        amountOut = numerator / denominator;
    }
    
    /**
     * @dev Get bond information by ISIN
     */
    function getBondInfo(string calldata isin) external view returns (TokenizedBond memory) {
        return tokenizedBonds[isin];
    }
    
    /**
     * @dev Get current pool reserves and LP token supply
     */
    function getPoolInfo() external view returns (uint256, uint256, uint256) {
        return (liquidityPool.reserveBAT, liquidityPool.reserveMDR, liquidityPool.totalLPTokens);
    }
    
    // ============= UTILITY FUNCTIONS =============
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
    
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}