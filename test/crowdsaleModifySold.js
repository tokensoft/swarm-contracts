/* global web3, artifacts, it, assert, contract */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
var timeHelper = require('./helpers/fastForwardTime')

contract('Swarm Crowd Sale Amount Sold', async (accounts) => {
  it('Contract should allow initializing amount sold to 0', async () => {
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
    await timeHelper.fastForward(100)

    let updatedRat = await crowdsale.getCurrentSaleRate()
    // Rate should be initial when starting at 0
    assert.equal(updatedRat.toNumber(), rate)
  })

  it('Contract should allow initializing amount sold to 1 million', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500
    let rate = 300
    let initialSold = convertToBaseUnits(1000000)

    // Deploy the crowd sale and initialize it
    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, rate, accounts[5], token.address, initialSold)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until right before the start time
    await timeHelper.fastForward(100)

    let updatedRat = await crowdsale.getCurrentSaleRate()
    // Rate should be lower when starting at 1 million
    assert.equal(updatedRat.toNumber(), 200)
  })

  it('Contract should allow updating amount sold to 1 million', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500
    let rate = 300

    // Deploy the crowd sale and initialize it - start at 0 sold
    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, rate, accounts[5], token.address, 0)
    await token.changeController(crowdsale.address)

    // Update the amount sold to 1 million
    let updatedSold = convertToBaseUnits(1000000)
    await crowdsale.setBaseTokensSold(updatedSold)

    await crowdsale.initializeToken()

    // Mine until right before the start time
    await timeHelper.fastForward(100)

    let updatedRat = await crowdsale.getCurrentSaleRate()
    // Rate should be lower when starting at 1 million
    assert.equal(updatedRat.toNumber(), 200)
  })

  it('Contract should block non-owners from updating amount sold', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500
    let rate = 300

    // Deploy the crowd sale and initialize it - start at 0 sold
    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, rate, accounts[5], token.address, 0)
    await token.changeController(crowdsale.address)

    // Update the amount sold to 1 million
    let updatedSold = convertToBaseUnits(1000000)

    try {
      await crowdsale.setBaseTokensSold(updatedSold, {from: accounts[2]})
      assert.fail('Should not allow non owner to update sold amount')
    } catch (ex) {
    }
  })
})
