/* global web3, artifacts, it, assert, contract */
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
const assertJump = require('./helpers/assertJump')

contract('Swarm Token ETH handler', async (accounts) => {
  it('should not allow to send eth to token contract', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Should fail to allow eth to be sent
    try {
      await web3.eth.sendTransaction({from: accounts[3], to: token.address, value: convertToBaseUnits(1), gas: 200000})
      assert.fail('After pause should fail')
    } catch (error) {
      assertJump(error)
    }
  })
})
