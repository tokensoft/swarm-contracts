var SwarmToken = artifacts.require('./token/SwarmToken.sol')

module.exports = async function (callback) {
  var contractInst = SwarmToken.at('0x1111111111111111111111111111111111111111')

  console.log('Data payload for triggering enableTransfers(false)')
  console.log(contractInst.enableTransfers.request(false).params[0].data)
  // 0xf41e60c50000000000000000000000000000000000000000000000000000000000000000
  console.log('')
}
