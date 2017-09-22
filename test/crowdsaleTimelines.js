/* global web3, artifacts, it, assert, contract */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
var timeHelper = require('./helpers/fastForwardTime')
const assertJump = require('./helpers/assertJump')

contract('Swarm Crowd Sale Timelines', async (accounts) => {
  it('Contract should enforce start and end block', async () => {
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

    // Mine until right before the start time
    await timeHelper.fastForward(10)

    // Before the start time should fail
    try {
      await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})
      assert.fail('Before the start block should fail')
    } catch (error) {
      assertJump(error)
    }

    // Mine until start time
    await timeHelper.fastForward(100)

    // Should succeed on start block
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})

    // Mine until right before end block
    await timeHelper.fastForward(250)

    // Should succeed on last block
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})

    // Mine one more block
    await timeHelper.fastForward(250)

    // After the end block should fail
    try {
      await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})
      assert.fail('After the end block should fail')
    } catch (error) {
      assertJump(error)
    }
  })
})
