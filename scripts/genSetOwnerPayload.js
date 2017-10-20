var SwarmToken = artifacts.require('./crowdsale/SwarmToken.sol')
var Multisig = artifacts.require('./multisig/MultisigWallet.sol')

module.exports = async function (callback) {
  var tokenInst = SwarmToken.at('0x1111111111111111111111111111111111111111')
  var mutlisgInst = Multisig.at('0x1111111111111111111111111111111111111111')

  console.log('Data payload to transfer ownership')
  let payload = tokenInst.changeController.request('XXX').params[0].data
  console.log(payload)
  console.log('')

  console.log(mutlisgInst.submitTransaction.request('XXX', 0, payload).params[0].data)
  console.log('')
}
