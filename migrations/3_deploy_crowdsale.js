/* global artifacts */
var MultiSigWallet = artifacts.require('./multisig/MultiSigWallet.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')

module.exports = function (deployer, network, accounts) {
  deployer.then(function () {
    // Get the deployed multisig
    return MultiSigWallet.deployed()
  }).then(function (deployedMultiSig) {
    console.log('Deploying crowdsale with owner:', deployedMultiSig.address)

    // Deploy the crowd sale with params
    let startBlock = 1000
    let endBlock = 10000
    let rate = 300

    return deployer.deploy(SwarmCrowdsale, startBlock, endBlock, rate, deployedMultiSig.address)
  })
}
