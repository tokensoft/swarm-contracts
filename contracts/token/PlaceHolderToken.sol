pragma solidity ^0.4.13;

import "../zeppelin/token/MintableToken.sol";

// Token to use on the Neuron Network
contract PlaceHolderToken is MintableToken {
    // Public variables
    string constant public name = "Test Token"; 
    string constant public symbol = "TST";
    uint constant public decimals = 18;
    
    // Constants for creating 100 million tokens
    uint constant MILLION = 10 ** 6;
    uint constant BASE_UNITS = 10 ** decimals;    
    uint constant INITIAL_SUPPLY = 100 * MILLION * BASE_UNITS;

    // Initialize the token and set the account that created this contract as the owner of all tokens.
    function PlaceHolderToken() {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
}