/* global artifacts */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')

let factory
let token
let crowdsale

module.exports = function (deployer, network, accounts) {
  let multisigAddress = '0x8bf7b2d536d286b9c5ad9d99f608e9e214de63f0'

  deployer.then(function () {
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
    let startBlock = 4248665
    let endBlock = 4248665 + 54600

    // USD Rate for tokens
    let rate = 310

    // Deploy the crowd sale
    return deployer.deploy(SwarmCrowdsale, startBlock, endBlock, rate, multisigAddress, token.address)
  }).then(function () {
    // Get the deployed crowd sale
    return SwarmCrowdsale.deployed()
  }).then(function (deployedSale) {
    // Save off the deployed crowdsale
    crowdsale = deployedSale

    // Set the owner of the token to the crowdsale contract to allow minting
    console.log('Changing controller address for token')
    return token.changeController(crowdsale.address)
  })

  // .then(() => {

  //   // Initialize the crowdsale so that initial tokens are assigned
  //   console.log('Initializing crowdsale')
  //   return crowdsale.initializeToken()
  // }).then(() => {
  //   // Set the multisig address as the owner
  //   return crowdsale.transferOwnership(multisigAddress)
  // })
}
