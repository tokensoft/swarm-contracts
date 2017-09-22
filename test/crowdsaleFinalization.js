/* global web3, artifacts, it, assert, contract */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
var timeHelper = require('./helpers/fastForwardTime')

contract('Swarm Crowd Sale Finalization', async (accounts) => {
  it('should transfer all to owner wallet if none sold', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500

    let rate = 300

    // Deploy the crowd sale and initialize it - Account 5 will get forwarded funds
    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, rate, accounts[5], token.address, 0)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until after end bloc
    await timeHelper.fastForward(2000)

    // Finalize the sale
    await crowdsale.finalize()

    // Verify all 33 million tokens got sent to Account 5
    let amt = await token.balanceOf(accounts[5])

    assert(amt.equals(convertToBaseUnits(33000000)), 'All 33 million should be transferred')
  })

  it('should transfer partial to owner wallet if some sold', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500
    let rate = 300

    // Deploy the crowd sale and initialize it - Account 5 will get forwarded funds
    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, rate, accounts[5], token.address, 0)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until start block
    await timeHelper.fastForward(100)

    // Buy some tokens
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(10), gas: 200000})

    // Mine until after end bloc
    await timeHelper.fastForward(500)

    // Finalize the sale
    await crowdsale.finalize()

    // Verify all right number of tokens got sent to Account 5
    let amt = await token.balanceOf(accounts[5])

    assert(amt.equals(convertToBaseUnits(33000000 - (10 * 300))), 'All, minus 3000, should be transferred')
  })

  it('should transfer none to owner wallet if all sold', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500

    // Set the rate really high so we can buy them all easily (1 million per ETH)
    let rate = 1000000

    // Deploy the crowd sale and initialize it - Account 5 will get forwarded funds
    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, rate, accounts[5], token.address, 0)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until start block
    await timeHelper.fastForward(100)

    // Buy some tokens
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(33), gas: 200000})
    console.log('fast forward')
    // Mine until after end bloc
    await timeHelper.fastForward(500)

    // Finalize the sale
    await crowdsale.finalize()

    // Verify all right number of tokens got sent to Account 5
    let amt = await token.balanceOf(accounts[5])

    assert(amt.equals(0), 'No tokens should be transferred.')
  })

  it('should change ownership of token after finalization', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500
    let rate = 300

    // Deploy the crowd sale and initialize it - Account 5 will get forwarded funds
    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, rate, accounts[5], token.address, 0)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until start block
    await timeHelper.fastForward(100)

    // Buy some tokens
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})

    // Mine until after end bloc
    await timeHelper.fastForward(500)

    assert.equal(await token.controller(), crowdsale.address, 'Crowdsale should be owner before finalization')

    // Finalize the sale
    await crowdsale.finalize()

    assert.equal(await token.controller(), accounts[5], 'Crowdsale multisig should be owner after finalization')
  })
})
