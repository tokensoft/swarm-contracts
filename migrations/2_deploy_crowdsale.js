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
  // These are the owners of the multisig contract to accept all payments from the crowd sale.
  let owners = [
    accounts[0],
    accounts[1],
    accounts[2]
  ]

  // The is the required number of signatures required for the multisig wallet
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

    // Deploy the crowd sale with params
    let startBlock = 20
    let endBlock = 40
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
  })
}
