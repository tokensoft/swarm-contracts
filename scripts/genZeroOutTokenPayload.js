var SwarmToken = artifacts.require('./token/SwarmToken.sol')

module.exports = async function (callback) {
  var contractInst = SwarmToken.at('0x1111111111111111111111111111111111111111')

  console.log('Data payload for zeroing balance with Address 0x48aE24B90f4eeCc0273C8053c7F8A99beF6fca2D and amt 1000000000000000000')
  console.log(contractInst.destroyTokens.request('0x48aE24B90f4eeCc0273C8053c7F8A99beF6fca2D', '1000000000000000000').params[0].data)
  // 0xd3ce77fe00000000000000000000000048ae24b90f4eecc0273c8053c7f8a99bef6fca2d0000000000000000000000000000000000000000000000000de0b6b3a7640000
  console.log('')
}
