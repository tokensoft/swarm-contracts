/* global web3, artifacts, it, assert, contract */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
var timeHelper = require('./helpers/fastForwardTime')
const assertJump = require('./helpers/assertJump')

contract('Swarm Crowd Sale Pausing', async (accounts) => {
  it('Contract should not allow purchases when paused', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500
    let rate = 300

    // Deploy the crowd sale and initialize it
    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, rate, accounts[5], token.address, 0)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until start block
    await timeHelper.fastForward(100)

    // Should succeed on start block
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})

    // Pause it
    await crowdsale.pause()

    // After paused should fail
    try {
      await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})
      assert.fail('After pause should fail')
    } catch (error) {
      assertJump(error)
    }

    // Unpause it
    await crowdsale.unpause()

    // Should succeed again
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})
  })
})
