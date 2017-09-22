/* global web3, artifacts, it, assert, contract */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
var timeHelper = require('./helpers/fastForwardTime')

contract('Swarm Crowd Sale Forwarding', async (accounts) => {
  it('should forward fund to wallet', async () => {
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

    await timeHelper.fastForward(100)

    let beforeBalance = web3.eth.getBalance(accounts[5])

    // Trigger some buys
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})
    await web3.eth.sendTransaction({from: accounts[8], to: crowdsale.address, value: convertToBaseUnits(2), gas: 200000})
    await web3.eth.sendTransaction({from: accounts[7], to: crowdsale.address, value: convertToBaseUnits(3), gas: 200000})
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(40), gas: 200000})

    let afterBalance = web3.eth.getBalance(accounts[5])

    assert(beforeBalance.plus(convertToBaseUnits(1 + 2 + 3 + 40)).equals(afterBalance), 'Funds should have been forwarded')
  })
})
