const BigNumber = require('bignumber.js')
var SwarmToken = artifacts.require('./crowdsale/SwarmToken.sol')
var Multisig = artifacts.require('./multisig/MultisigWallet.sol')

module.exports = async function (callback) {
  var tokenInst = SwarmToken.at('0x1111111111111111111111111111111111111111')
  var mutlisgInst = Multisig.at('0x1111111111111111111111111111111111111111')

  const SWMTokenContract = '0x9e88613418cf03dca54d6a2cf6ad934a78c7a17a'
  const AddressToSendTokens = '0x67ec2f42940b516c4c76342219fd2684c8747fbb'
  const amountOfTokensToSend = new BigNumber('16739999').mul(new BigNumber(10).toPower(18))

  // transfer(address _to, uint256 _amount)
  let payload = tokenInst.transfer.request(
    AddressToSendTokens,
    amountOfTokensToSend
  ).params[0].data

  console.log('Multisig Transaction Payload:')
  console.log(mutlisgInst.submitTransaction.request(SWMTokenContract, 0, payload).params[0].data)
  console.log('')
}
