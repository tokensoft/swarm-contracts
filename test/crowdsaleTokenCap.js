/* global web3, artifacts, it, assert, contract */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
var blockHelper = require('./helpers/miner')
const assertJump = require('./helpers/assertJump')

contract('Swarm Crowd Sale Cap', async (accounts) => {
  it('Contract should enforce max purchase', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startBlock = web3.eth.blockNumber + 10
    let endBlock = web3.eth.blockNumber + 20

    // Set the rate really high so we can reach the cap on the second buy
    let rate = 40000000

    // Deploy the crowd sale and initialize it
    let crowdsale = await SwarmCrowdsale.new(startBlock, endBlock, rate, accounts[5], token.address)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until start block
    await blockHelper.mineBlock(startBlock - 1)

    // Should succeed on start block
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})

    // Second sale should sell due to over the limit
    try {
      await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})
      assert.fail('After the end block should fail')
    } catch (error) {
      assertJump(error)
    }
  })

  it('Contract should allow max purchase', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy the crowd sale with params
    let startBlock = web3.eth.blockNumber + 10
    let endBlock = web3.eth.blockNumber + 20

    // Set the rate really high so we can reach the cap on the second buy
    let rate = 43290000

    // Deploy the crowd sale and initialize it
    let crowdsale = await SwarmCrowdsale.new(startBlock, endBlock, rate, accounts[5], token.address)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()

    // Mine until start block
    await blockHelper.mineBlock(startBlock - 1)

    // Should succeed on start block
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})

    // Second sale should sell due to over the limit
    try {
      await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})
      assert.fail('After the end block should fail')
    } catch (error) {
      assertJump(error)
    }
  })
})
