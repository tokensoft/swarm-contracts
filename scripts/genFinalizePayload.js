var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')

module.exports = async function (callback) {
  var contractInst = SwarmCrowdsale.at('0x1111111111111111111111111111111111111111')

  console.log('Data payload for triggering finalize()')
  console.log(contractInst.finalize.request().params[0].data) // 0x4bb278f3
  console.log('')
}
