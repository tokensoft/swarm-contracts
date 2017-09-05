/* global web3, artifacts, it, assert, contract */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var MultiSigWallet = artifacts.require('./multisig/MultiSigWallet.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var convertToBaseUnits = require('./helpers/convertToBaseUnits')
var blockHelper = require('./helpers/miner')
var fastForwardTime = require('./helpers/fastForwardTime')

let vestPeriod = 42 * 24 * 60 * 60

contract('Swarm Transfer after sale', async (accounts) => {
  it('should allow trnsfer with multisig', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Deploy a multisig and require 2 confirmation for accounts
    let multisig = await MultiSigWallet.new([accounts[0], accounts[1]], 2)

    // Deploy the crowd sale with params
    let startBlock = web3.eth.blockNumber + 10
    let endBlock = web3.eth.blockNumber + 20
    let rate = 300

    // Deploy the crowd sale and initialize it with the multisig contract
    let crowdsale = await SwarmCrowdsale.new(startBlock, endBlock, rate, multisig.address, token.address)
    await token.changeController(crowdsale.address)
    await crowdsale.initializeToken()
    await crowdsale.transferOwnership(multisig.address)

    // Mine until start block
    await blockHelper.mineBlock(startBlock)

    // Make a purchase from accounts[9]
    await web3.eth.sendTransaction({from: accounts[9], to: crowdsale.address, value: convertToBaseUnits(1), gas: 200000})

    // Mine until after the end of the sale
    await blockHelper.mineBlock(endBlock + 1)

    // Get the finalization data blob
    let finalizeData = crowdsale.finalize.request().params[0].data

    // Submit a tx to the multisig for finalizing
    await multisig.submitTransaction(crowdsale.address, 0, finalizeData, {from: accounts[0]})

    let trxId = await multisig.transactionCount() - 1

    // Approve it from acct 1
    await multisig.confirmTransaction(trxId, {from: accounts[1], gas: 500000})

    // Now that trx is finalized, fast forward vesting
    // Update block time end of vesting period
    await fastForwardTime.fastForward(vestPeriod * 8)

    // After vesting, verify account[9] can transfer some tokens they bought
    await token.transfer(accounts[2], convertToBaseUnits(1), { from: accounts[9] })
  })
})
