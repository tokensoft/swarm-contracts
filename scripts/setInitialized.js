const Web3 = require('web3')
const BigNumber = require('bignumber.js')
var yesno = require('yesno')

module.exports = async function (callback) {
  console.log('Loading Contract')
  let crowdSaleDef = require('../build/contracts/SwarmCrowdsale.json')
  let crowdsaleABI = crowdSaleDef.abi
  let crowdSaleContract = web3.eth.contract(crowdsaleABI)
  let crowdsaleInstance = crowdSaleContract.at('XXX')

  console.log('')

  console.log('You are about to initialize the crowdsale.  You will no longer be able to mint preallocated tokens after you do this.')
  console.log('')
  yesno.ask('Are you sure you want to continue?', false, function (ok) {
    if (ok) {
      console.log('Initializing the Crowdsale...')
      crowdsaleInstance.initializeToken({ gasPrice: 21000000000, gas: 100000, from: 'XXX' })

      process.exit(0)
    } else {
      console.log('Exiting...')
      console.log('')
      process.exit(-1)
    }
  })
}
