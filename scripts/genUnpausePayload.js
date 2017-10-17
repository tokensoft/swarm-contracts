var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var Multisig = artifacts.require('./multisig/MultisigWallet.sol')

module.exports = async function (callback) {
  var contractInst = SwarmCrowdsale.at('0x1111111111111111111111111111111111111111')
  var mutlisgInst = Multisig.at('0x1111111111111111111111111111111111111111')

  console.log('Data payload for triggering pause()')
  let payload = contractInst.pause.request().params[0].data
  console.log(payload)

  // console.log(mutlisgInst.submitTransaction.request('0xF18023908a52D7f058D40277f947748ab9619ef1', 0, payload).params[0].data)

  console.log('')
}
