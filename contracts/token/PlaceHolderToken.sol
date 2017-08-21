pragma solidity ^0.4.13;

import "../zeppelin/token/MintableToken.sol";

// Token to use on the Neuron Network
contract PlaceHolderToken is MintableToken {
    using SafeMath for uint256;

    // Public variables
    string constant public name = "Test Token"; 
    string constant public symbol = "TST";
    uint constant public decimals = 18;
    
    // Constants for creating 100 million tokens
    uint256 constant MILLION = 10 ** 6;
    uint256 constant BASE_UNITS = 10 ** decimals;    
    uint256 constant INITIAL_SUPPLY = 100 * MILLION * BASE_UNITS;

    // Initialize the token and set the account that created this contract as the owner of all tokens.
    function PlaceHolderToken() {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    // Calculate Vesting
    // Each vesting period is 42 days, with a max of 8 periods
    uint256 constant public VESTING_PERIOD_TIME = 42 days;
    uint256 constant public VESTING_TOTAL_PERIODS = 8;
    uint256 public vestingStartTimestamp = 0;

    /**
     * Gets the number of vesting periods that have completed from the start time to the current time.
     */
    function getVestingPeriodsCompleted(uint256 vestingStartTime, uint256 currentTime) public constant returns (uint256) {
        return currentTime.sub(vestingStartTime).div(VESTING_PERIOD_TIME);
    }

    /**
     * Gets the vested balance for an account.
     * initialBalance - The amount that was allocated at the start of vesting.
     * currentBalance - The amount that is current in the account.
     * vestingStartTime - The time stamp (seconds since unix epoch) when vesting started.
     * currentTime - The current time stamp (seconds since unix epoch).
     */
    function getVestedBalance(uint256 initialBalance, uint256 currentBalance, uint256 vestingStartTime, uint256 currentTime)
        public constant returns (uint256)
    {

        // First, get the number of vesting periods completed
        uint256 vestedPeriodsCompleted = getVestingPeriodsCompleted(vestingStartTime, currentTime);

        // If all the vesting periods are completed then nothing should be withheld.
        if (vestedPeriodsCompleted >= VESTING_TOTAL_PERIODS) {
            return currentBalance;
        }

        // Vesting period is not over.  Calculate the amount that should be withheld.
        uint256 vestingPeriodsRemaining = VESTING_TOTAL_PERIODS - vestedPeriodsCompleted;
        uint256 unvestedBalance = initialBalance.mul(vestingPeriodsRemaining).div(VESTING_TOTAL_PERIODS);
        return currentBalance.sub(unvestedBalance);
    }
}