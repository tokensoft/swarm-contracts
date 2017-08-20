/* global artifacts */
var MultiSigWallet = artifacts.require('./multisig/MultiSigWallet.sol')

module.exports = function (deployer, network, accounts) {
  let owners = [
    accounts[0]
  ]
  let requiredSignerCount = 1

  // Deploy wallet with owners and required signers
  deployer.deploy(MultiSigWallet, owners, requiredSignerCount)
}
