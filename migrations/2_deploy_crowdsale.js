/* global artifacts, web3 */
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var MultiSigWallet = artifacts.require('./multisig/MultiSigWallet.sol')
var BigNumber = require('bignumber.js')

let factory
let token
let crowdsale
let wallet

module.exports = function (deployer, network, accounts) {
  // let multisigAddress = '0x8bf7b2d536d286b9c5ad9d99f608e9e214de63f0'

  deployer.then(function () {
    return deployer.deploy(MultiSigWallet, ['0xeE87766610B101E3414446b84dfa10756091E76C'], 1)
  }).then(function () {
    return MultiSigWallet.deployed()
  }).then((deployedWallet) => {
    wallet = deployedWallet

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
    // let startTime = 1508594400 //  Saturday, October 21, 2017 2:00:00 PM GMT
    // let endTime = 1509148800 // Saturday, October 28, 2017 12:00:00 AM GMT

    let startTime = 1506369600 // test
    let endTime = 1506384000 // test
    
    

    // USD Rate for tokens
    let rate = 310

    // let startSold = new BigNumber(999999).mul(new BigNumber(10).toPower(18)) // start at 999,999

    // Deploy the crowd sale
    return deployer.deploy(SwarmCrowdsale, startTime, endTime, rate, wallet.address, token.address, 0)
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
