pragma solidity ^0.4.13;

import "./MiniMeMintableToken.sol";
import '../zeppelin/math/SafeMath.sol';

/**
 * This contract defines the tokens for the SWARM platform.
 * It inherits from the MiniMeToken contract which allows sub-tokens to be created.
 * This token also implements a vesting schedule on any tokens that are minted during the pre-sale.
 * The MintableToken contract is adapted from the Open Zeppelin contract.
 */
contract MiniMeVestedToken is MiniMeMintableToken {
  using SafeMath for uint256;

  // This value will keep track of the time when the minting is finished after the crowd sale ends.
  // Vesting will start accruing at this point in time.
  uint256 public vestingStartTime = 0;

  // Default vesting period is 42 days, with a max of 8 periods
  uint256 public vestingPeriodTime = 42 days;
  uint256 public vestingTotalPeriods = 8;

  // Pass through consructor
  function MiniMeVestedToken(
    address _tokenFactory,
    address _parentToken,
    uint _parentSnapShotBlock,
    string _tokenName,
    uint8 _decimalUnits,
    string _tokenSymbol,
    bool _transfersEnabled
  ) 
  MiniMeMintableToken(
    _tokenFactory,
    _parentToken,
    _parentSnapShotBlock,
    _tokenName,
    _decimalUnits,
    _tokenSymbol,
    _transfersEnabled
  )
  {
  }

////////////////////
// Token Transfers
////////////////////

  /**
   * Modifier to functions to see if the vested balance is higher than requested transfer amount.
   * Also enforces that the minting phase of the sale is over.
   */
  modifier canTransfer(address _sender, uint _value) {
    require(mintingFinished);
    require(_value <= vestedBalanceOf(_sender));
    _;
  }

  /**
   * Override the base transfer class to enforce vesting requirement is met
   */
  function transfer(address _to, uint _value)
    canTransfer(msg.sender, _value)
    public
    returns (bool success)
  {
    return super.transfer(_to, _value);
  }

  /**
   * Override the base transferFrom class to enforce vesting requirement is met
   */
  function transferFrom(address _from, address _to, uint _value)
    canTransfer(_from, _value)
    public
    returns (bool success)
  {
    return super.transferFrom(_from, _to, _value);
  }

////////////////////
// Token Vesting
///////////////////

  /**
   * Allow vesting schedule params to be overridden.
   */
  function setVestingParams(uint256 _vestingStartTime, uint256 _vestingTotalPeriods, uint256 _vestingPeriodTime) onlyController {
    vestingStartTime = _vestingStartTime;
    vestingTotalPeriods = _vestingTotalPeriods;
    vestingPeriodTime = _vestingPeriodTime;
  }

  /**
    * Gets the number of vesting periods that have completed from the start time to the current time.
    */
  function getVestingPeriodsCompleted(uint256 _vestingStartTime, uint256 _currentTime) public constant returns (uint256) {
      return _currentTime.sub(_vestingStartTime).div(vestingPeriodTime);
  }

  /**
    * Gets the vested balance for an account.
    * initialBalance - The amount that was allocated at the start of vesting.
    * currentBalance - The amount that is currently in the account.
    * vestingStartTime - The time stamp (seconds since unix epoch) when vesting started.
    * currentTime - The current time stamp (seconds since unix epoch).
    */
  function getVestedBalance(uint256 _initialBalance, uint256 _currentBalance, uint256 _vestingStartTime, uint256 _currentTime)
      public constant returns (uint256)
  {
      // Short-cut if vesting hasn't started yet
      if (_currentTime < _vestingStartTime) {
        return 0;
      }
      
      // Short-cut the vesting calculations if the vesting periods are completed
      if (_currentTime >= _vestingStartTime.add(vestingPeriodTime.mul(vestingTotalPeriods))) {
          return _currentBalance;
      }

      // First, get the number of vesting periods completed
      uint256 vestedPeriodsCompleted = getVestingPeriodsCompleted(_vestingStartTime, _currentTime);

      // Calculate the amount that should be withheld.
      uint256 vestingPeriodsRemaining = vestingTotalPeriods.sub(vestedPeriodsCompleted);
      uint256 unvestedBalance = _initialBalance.mul(vestingPeriodsRemaining).div(vestingTotalPeriods);

      // Return the current balance minus any that is still unvested.
      return _currentBalance.sub(unvestedBalance);
  }

  /**
   * Convenience method - Get the vested balance of the address.
   */
  function vestedBalanceOf(address _owner) public constant returns (uint256 balance) {
    return getVestedBalance(issuedTokens[_owner], balanceOf(_owner), vestingStartTime, block.timestamp);
  }

  /**
   * At the end of the sale, this should be called to trigger the vesting to start.
   * Tokens cannot be transferred prior to this being called.
   */
  function finishMinting() onlyController canMint returns (bool) {
    // Set the time stamp for tokens to start vesting
    vestingStartTime = block.timestamp;

    return super.finishMinting();
  }
}