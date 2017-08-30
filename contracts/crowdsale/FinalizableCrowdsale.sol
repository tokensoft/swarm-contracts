pragma solidity ^0.4.13;

import '../zeppelin/math/SafeMath.sol';
import '../zeppelin/lifecycle/Pausable.sol';
import './Crowdsale.sol';

/**
 * @title FinalizableCrowdsale
 * @dev Extension of Crowsdale where an owner can do extra work
 * after finishing. By default, it will end token minting.
 */
contract FinalizableCrowdsale is Crowdsale, Pausable {
  using SafeMath for uint256;

  bool public isFinalized = false;

  event Finalized();

  /**
   * Pass through constructor to parents.
   */
  function FinalizableCrowdsale (
    uint256 _startTime,
    uint256 _endTime,
    uint256 _rate,
    address _wallet,
    address _token
  )
    Crowdsale(_startTime, _endTime, _rate, _wallet, _token)
    Ownable()
  {
  }

  // should be called after crowdsale ends, to do
  // some extra finalization work
  function finalize() onlyOwner {
    require(!isFinalized);
    require(hasEnded());

    // Set the flag to prevent another finalization
    isFinalized = true;

    // Call the finalization function in the implementing class.
    finalization();

    // Trigger the finalized event.
    Finalized();
  }

  // end token minting on finalization
  // override this with custom logic if needed
  function finalization() internal;

}
