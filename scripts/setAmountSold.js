const Web3 = require('web3')
const BigNumber = require('bignumber.js')
var yesno = require('yesno')

module.exports = async function (callback) {
  console.log('Loading Contract')
  let crowdSaleDef = require('../build/contracts/SwarmCrowdsale.json')
  let crowdsaleABI = crowdSaleDef.abi
  let crowdSaleContract = web3.eth.contract(crowdsaleABI)
  let crowdsaleInstance = crowdSaleContract.at('XXX')

  console.log('Setting up parameters...')
  console.log('')

  let total = new BigNumber(8122578.22382251).mul(new BigNumber(10).toPower(18))

  console.log('You are about to set the total amount of tokens sold to: ' + total.div(new BigNumber(10).toPower(18)).toFormat() + ' tokens.')
  console.log('')
  yesno.ask('Are you sure you want to continue?', false, function (ok) {
    if (ok) {
      console.log('Setting amount sold tokens...')
      crowdsaleInstance.setBaseTokensSold(total, { gasPrice: 21000000000, gas: 100000, from: 'XXX' })

      process.exit(0)
    } else {
      console.log('Exiting...')
      console.log('')
      process.exit(-1)
    }
  })
}
