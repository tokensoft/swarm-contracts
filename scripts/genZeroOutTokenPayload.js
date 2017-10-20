var SwarmToken = artifacts.require('./token/SwarmToken.sol')

module.exports = async function (callback) {
  var contractInst = SwarmToken.at('0x1111111111111111111111111111111111111111')

  console.log('Data payload for zeroing balance with Address XXX and amt 1000000000000000000')
  console.log(contractInst.destroyTokens.request('XXX', '1000000000000000000').params[0].data)

  console.log('')
}
