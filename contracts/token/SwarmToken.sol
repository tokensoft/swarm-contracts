pragma solidity ^0.4.13;

import "./MiniMeVestedToken.sol";

contract SwarmToken is MiniMeVestedToken {

  /**
   * Constructor to initialize Swarm Token.
   * Factory is pre-deployed and passed in.
   *
   * @author poole_party via tokensoft.io
   */
  function SwarmToken(address _tokenFactory)
    MiniMeVestedToken(
      _tokenFactory,
      0x0,
      0,
      "Swarm Fund Token",
      18,
      "SWM",
      true
    )
    {}    
}