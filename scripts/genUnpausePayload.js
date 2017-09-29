var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var Multisig = artifacts.require('./multisig/MultisigWallet.sol')

module.exports = async function (callback) {
  var contractInst = SwarmCrowdsale.at('0x1111111111111111111111111111111111111111')
  var mutlisgInst = Multisig.at('0x1111111111111111111111111111111111111111')

  console.log('Data payload for triggering unpause()')
  let payload = contractInst.unpause.request().params[0].data

  console.log(mutlisgInst.submitTransaction.request('0x3B13F20CB484A87d4613b0ffe2d934d9c70CcCFd', 0, payload).params[0].data)

  console.log('')
}
