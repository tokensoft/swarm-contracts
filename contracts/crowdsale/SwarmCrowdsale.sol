pragma solidity ^0.4.13;

import './FinalizableCrowdsale.sol';
import '../zeppelin/math/SafeMath.sol';
import '../token/MiniMeToken.sol';
import '../token/MiniMeTokenFactory.sol';

/**
 * @title SwarmCrowdsale
 * @dev SwarmCrowdsale is a contract for managing a token crowdsale.
 * Crowdsales have a start and end block, where investors can make
 * token purchases and the crowdsale will assign them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet
 * as they arrive.
 * 
 * Time values are in block numbers.
 *
 * Rate is initial value of ETH in USD.  Each token starts out costing approx 1 USD and increases
 * as tokens are sold.  rate = USD price of ETH (e.g. "300")
 *
 * Wallet is the address where all incoming funds will be forwarded.  Should be a multisig for security.
 */
contract SwarmCrowdsale is FinalizableCrowdsale {
  using SafeMath for uint256;

  // The amount of tokens sold during the crowdsale
  uint public baseTokensSold = 0;

  // Token base units are 18 decimals
  uint256 constant TOKEN_DECIMALS = 10**18;

  // Minimum tokens sold is 33 million
  uint256 constant TOKEN_MIN_SOLD = 33 * 10**6 * TOKEN_DECIMALS;

  bool public initialized = false;

  /**
   * Pass through constructor to parents.
   */
  function SwarmCrowdsale (
    uint256 _startTime,
    uint256 _endTime,
    uint256 _rate,
    address _wallet,
    address _token
  )
    FinalizableCrowdsale(_startTime, _endTime, _rate, _wallet, _token)
  {
  }

    /**
    * Mints any tokens for the pre-allocations
    */
  function initializeToken() onlyOwner {
    // Allow this to only be called once by the owner.
    require(!initialized);
    initialized = true;
    
    // Example of a pre-allocation of 100 tokens
    token.mint(0x00e2b3204f29ab45d5fd074ff02ade098fbc381d42, 100 * 10**18);
  }

  /**
    * Overrides Base Function to allow division of sales rate instead of multiplier.
    * Instead of using whole number multiplier, we use a base unit value smaller than 1 ETH.
    */
  function buyTokens(address beneficiary) public payable {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;

    // Calculate token amount to be created.
    // Uses dynamic price calculator based on current number of sold tokens.
    uint256 tokens = weiAmount.mul(getSaleRate(baseTokensSold));

    // update state
    weiRaised = weiRaised.add(weiAmount);
    baseTokensSold = baseTokensSold.add(tokens);

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

    forwardFunds();
  }

  /**
    * Overrides Base Function.
    * Take any finalization actions here
    * Ends token minting on finalization
    */
    function finalization() internal {

      // Handle unsold token logic
      transferUnallocatedTokens();

      token.finishMinting();
    }

    /**
     * According to the terms of the sale, a minimum of 33 million tokens are to be distributed.
     * If the public does not buy 33 million tokens then the amount sold is subtracted from 33 million and allocated to the Swarm Foundation.
     * This function will mint any remaining tokens of the 33 minimum to the "wallet" account.
     */
    function transferUnallocatedTokens() internal {      

      // If the minimum amount sold was met, then take no action
      if (baseTokensSold > TOKEN_MIN_SOLD) {
        return;
      }

      // Minimum tokens were not sold.  Get the amount to transfer and assign to wallet address.
      uint256 amountToTransfer = TOKEN_MIN_SOLD.sub(baseTokensSold);
      token.mint(wallet, amountToTransfer);
    }

  /**
    * Gets the current price of the tokens based on the current sold amount (currentBaseTokensSold).
    * The variable "rate" from the base class is the initial purchase multiplier.
    * As new tokens get purchased, the price increases according the the algorithm outlined in the whitepaper.
    * Each generation you will get less tokens per ETH sent in.
    * param - uint256 currentTokensSold Amount of tokens already sold in "base units".
    * returns - uint256 Current number of tokens you get for each ETH sent in.
    */
  function getSaleRate(uint256 currentBaseTokensSold) public constant returns (uint256) {

    // Base units per token
    uint decimals = 10**18;

    // Get the whole units of tokens sold
    uint256 wholeTokensSold = currentBaseTokensSold.div(decimals);

    // Get the current generation of the token sale.  Each gen is 1 million whole tokens.
    uint256 generation = wholeTokensSold.div(10**6);

    // Init the price multiplier at 0.  It should always go through the loop below at least once.
    uint256 priceMultiplier = 0;

    // Each generation adds on a price premium that decreases with each generation.
    for (uint i = 0; i <= generation; i++) {

      // The multiplier is calculated at 10^18 units since uint256 can't handle decimals.
      priceMultiplier = priceMultiplier.add(decimals.div(1 + i));
    }

    // Return the initial rate divided by the multiplier.
    // To ensure int division doesn't truncate, using rate * 10^18 in numerator.      
    // If initial rate is 300 then the second generation should return => 300*10^18 / 1.5*10^18  => 200
    return rate.mul(decimals).div(priceMultiplier);
  }
}
