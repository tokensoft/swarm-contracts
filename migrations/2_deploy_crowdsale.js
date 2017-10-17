/* global artifacts */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')

const multisigAddress = '0x8bf7b2d536d286b9c5ad9d99f608e9e214de63f0'

let factory
let token
let crowdsale

module.exports = function (deployer, network, accounts) {
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

    // Deploy the crowd sale with params
    let startTime = 1508594400 //  Saturday, October 21, 2017 2:00:00 PM GMT
    let endTime = 1509148800 // Saturday, October 28, 2017 12:00:00 AM GMT

    // Initial USD Rate for tokens
    let rate = 310

    // Deploy the crowd sale
    return deployer.deploy(SwarmCrowdsale, startTime, endTime, rate, multisigAddress, token.address, 0)
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
}
