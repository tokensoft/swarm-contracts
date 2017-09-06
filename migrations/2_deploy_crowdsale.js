/* global artifacts */
var MultiSigWallet = artifacts.require('./multisig/MultiSigWallet.sol')
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')

let multisig
let factory
let token
let crowdsale

module.exports = function (deployer, network, accounts) {
  // The owners of the multisig contract to accept all payments from the crowd sale.
  let owners = [
    '0xbf1effc5591db80b5f529e0403abe0dc1919bb50', // Timo
    '0x7f33e15b32c83018662a7a5eeb1d2b0d970364c6', // Joel
    '0x41f638c13260727061133eb4990ad61309a2b40a'  // Philipp
  ]

  // The required number of signatures required for the multisig wallet
  let requiredSignerCount = 2

  deployer.then(function () {
    // Deploy wallet with owners and required signers
    return deployer.deploy(MultiSigWallet, owners, requiredSignerCount)
  }).then(() => {
    // Get the deployed multisig
    return MultiSigWallet.deployed()
  }).then(function (deployedMultiSig) {
    // Save off the multisig
    multisig = deployedMultiSig

    // Deploy the factory
    return deployer.deploy(MiniMeTokenFactory)
  }).then(function () {
      // Get the deployed factory
    return MiniMeTokenFactory.deployed()
  }).then((deployedFactory) => {
    // Save off the factory
    factory = deployedFactory

    // Deploy the token
    return deployer.deploy(SwarmToken, factory.address)
  }).then(() => {
    // Get the deployed token
    return SwarmToken.deployed()
  }).then((deployedToken) => {
    // Save off the token
    token = deployedToken

    // Block times - https://etherscan.io/chart/blocktime
    // Use 25 seconds
    // START = 36 hours from 7:00 PM on Tuesday night = NOW_TIME + 36 * 60 / 24 => NOW_TIME + 129,600 / 24 => NOW_BLOCK + 5400
    // END = START_TIME + 22 Days => START_TIME + 22 * 24 * 60 * 60 / 24 = > START_BLOCK + 79200

    // Deploy the crowd sale with params
    let startBlock = 20
    let endBlock = 40

    // USD Rate for tokens
    let rate = 300

    // Deploy the crowd sale
    return deployer.deploy(SwarmCrowdsale, startBlock, endBlock, rate, multisig.address, token.address)
  }).then(function () {
    // Get the deployed crowd sale
    return SwarmCrowdsale.deployed()
  }).then(function (deployedSale) {
    // Save off the deployed crowdsale
    crowdsale = deployedSale

    // Set the owner of the token to the crowdsale contract to allow minting
    console.log('Changing controller address for token')
    return token.changeController(crowdsale.address)
  }).then(() => {
    // Initialize the crowdsale so that initial tokens are assigned
    console.log('Initializing crowdsale')
    return crowdsale.initializeToken()
  }).then(() => {
    // Set the multisig address as the owner
    return crowdsale.transferOwnership(multisig.address)
  })
}
