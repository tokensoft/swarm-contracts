pragma solidity ^0.4.15;

import './zeppelin/crowdsale/FinalizeableCrowdsale.sol';

/**
 * @title SwarmCrowdsale
 * @dev SwarmCrowdsale is a contract for managing a token crowdsale.
 * Crowdsales have a start and end block, where investors can make
 * token purchases and the crowdsale will assign them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet
 * as they arrive.
 */
contract SwarmCrowdsale is FinalizeableCrowdsale {

    // The amount of tokens sold during the crowdsale
    uint public baseTokensSold = 0;

    //                       10**18
    // Initial rate =  ------------------
    //                  USD Price of ETH

    /**
     * Overrides Base Function.
     * It will return the token contract and also trigger any initial token allocations to be made.
     * @return {[type]} [description]
     */
    function createTokenContract() internal returns (MintableToken) {
      // TODO have token and factory get sent into constructor
      address minimeToken = address(0x0);
      allocateInitialTokens(minimeToken);

      return minimeToken;
    }

    /**
     * Overrides Base Function to allow division of sales rate instead of multiplier.
     * Instead of using whole number multiplier, we use a base unit value smaller than 1 ETH.
     * @param  {[type]} address [description]
     */
    function buyTokens(address beneficiary) public payable {
      require(beneficiary != 0x0);
      require(validPurchase());

      uint256 weiAmount = msg.value;

      // Verify that the user is not trying to send in less than the initial rate (1 USD).
      // This would result in 0 tokens getting issued.
      require(weiAmount >= rate);

      // Calculate token amount to be created.
      // Uses dynamic price calculator based on current number of sold tokens.
      uint256 tokens = weiAmount.div(getSaleRate(tokensSold));

      // update state
      weiRaised = weiRaised.add(weiAmount);
      tokensSold = tokensSold.add(tokens);

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
       token.finishMinting();
     }

    /**
     * Gets the current price of the tokens based on weiRaised.
     * The variable "rate" from the base class is the initial purchase price.
     * As new tokens get purchased, the price increases according the the algorithm outlined in the whitepaper.
     * @param  {uint256} currentTokensSold Amount of tokens already sold in base units to use in pricing function.
     * @return {uint256} Current price in wei per token base unit.
     */
    function getSaleRate(uint256 currentBaseTokensSold) public returns (uint256) {

      // Base units per token
      uint decimals = 10**18;

      // Get the whole units of tokens sold
      uint256 wholeTokensSold = currentTokensSold.div(decimals);

      // Get the current generation of the token sale.  Each gen is 1 million whole tokens.
      uint256 generation = wholeTokensSold.div(10**6);

      // Init the price multiplier at 0.  It should always go through the loop below.
      uint256 priceMultiplier = 0;

      // Each generation adds a price premium that decreases with each generation.
      for (uint i = 0; i <= generation; i++) {

        // The multiplier is calculated at 10^18 units since uints can't hanlde decimals.
        priceMultiplier += decimals.div(1 + i);
      }

      // Return the initial rate times the multiplier and divide out the multiplier units.
      return rate.mul(priceMultiplier).div(10**18);
    }

    /**
     * Mints initial token allocations
     * @param  {[type]} contract [description]
     * @return {[type]}          [description]
     */
    function allocateInitialTokens(MintableToken tokenContract) internal {

    }
}
