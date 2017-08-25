/* global web3, artifacts, it, assert, contract */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
var blockHelper = require('./helpers/miner')

contract('Swarm Crowd Sale Finalization', async (accounts) => {
  it('should transfer all to owner wallet if none sold', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startBlock = web3.eth.blockNumber + 5
    let endBlock = web3.eth.blockNumber + 7
    let rate = 300

    // Deploy the crowd sale and initialize it - Account 5 will get forwarded funds
    let crowdsale = await SwarmCrowdsale.new(startBlock, endBlock, rate, accounts[5], token.address)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until after end bloc
    await blockHelper.mineBlock(endBlock + 1)

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
    let startBlock = web3.eth.blockNumber + 5
    let endBlock = web3.eth.blockNumber + 7
    let rate = 300

    // Deploy the crowd sale and initialize it - Account 5 will get forwarded funds
    let crowdsale = await SwarmCrowdsale.new(startBlock, endBlock, rate, accounts[5], token.address)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until start block
    await blockHelper.mineBlock(startBlock)

    // Buy some tokens
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(10), gas: 200000})

    // Mine until after end bloc
    await blockHelper.mineBlock(endBlock + 1)

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
    let startBlock = web3.eth.blockNumber + 5
    let endBlock = web3.eth.blockNumber + 7

    // Set the rate really high so we can buy them all easily (1 million per ETH)
    let rate = 1000000

    // Deploy the crowd sale and initialize it - Account 5 will get forwarded funds
    let crowdsale = await SwarmCrowdsale.new(startBlock, endBlock, rate, accounts[5], token.address)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until start block
    await blockHelper.mineBlock(startBlock)

    // Buy some tokens
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(33), gas: 200000})

    // Mine until after end bloc
    await blockHelper.mineBlock(endBlock + 1)

    // Finalize the sale
    await crowdsale.finalize()

    // Verify all right number of tokens got sent to Account 5
    let amt = await token.balanceOf(accounts[5])

    assert(amt.equals(0), 'No tokens should be transferred.')
  })
})
