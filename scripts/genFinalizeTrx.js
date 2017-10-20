var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var Multisig = artifacts.require('./multisig/MultisigWallet.sol')

module.exports = async function (callback) {
  var contractInst = SwarmCrowdsale.at('0x1111111111111111111111111111111111111111')

  var mutlisgInst = Multisig.at('0x1111111111111111111111111111111111111111')

  console.log('Data payload for triggering finalize()')
  let payload = contractInst.finalize.request().params[0].data // 0x4bb278f3

  console.log(mutlisgInst.submitTransaction.request('XXX', 0, payload).params[0].data)
  console.log('')
}
