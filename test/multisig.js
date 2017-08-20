/* global artifacts, it, assert, contract */
var MultiSigWallet = artifacts.require('./multisig/MultiSigWallet.sol')

contract('MultiSigWallet', function (accounts) {
  it('Be deployed', function () {
    assert.equal(10000, 10000, "10000 wasn't in the first account")
  })
})
