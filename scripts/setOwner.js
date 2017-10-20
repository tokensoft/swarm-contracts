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
  let newOwner = 'XXX'

  if (!web3.isAddress(newOwner)) {
    console.error('Invalid address set as new owner')
    process.exit(-1)
  }

  console.log('You are about to transfer ownership to ' + newOwner + '.  After this is done your account will no longer control the contract.')
  console.log('')
  yesno.ask('Are you sure you want to continue?', false, function (ok) {
    if (ok) {
      console.log('Transferring ownership...')
      crowdsaleInstance.transferOwnership(newOwner, { gasPrice: 21000000000, gas: 100000, from: 'XXX' })

      process.exit(0)
    } else {
      console.log('Exiting...')
      console.log('')
      process.exit(-1)
    }
  })
}
