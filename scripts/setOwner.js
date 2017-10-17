const Web3 = require('web3')
const BigNumber = require('bignumber.js')
var yesno = require('yesno')

module.exports = async function (callback) {
  console.log('Loading Contract')
  let crowdSaleDef = require('../build/contracts/SwarmCrowdsale.json')
  let crowdsaleABI = crowdSaleDef.abi
  let crowdSaleContract = web3.eth.contract(crowdsaleABI)
  let crowdsaleInstance = crowdSaleContract.at('0x5feeaede27be6f587e85aa6c64381fe8b63a3ebe')

  console.log('')
  let newOwner = '0x8bf7b2d536d286b9c5ad9d99f608e9e214de63f0'

  if (!web3.isAddress(newOwner)) {
    console.error('Invalid address set as new owner')
    process.exit(-1)
  }

  console.log('You are about to transfer ownership to ' + newOwner + '.  After this is done your account will no longer control the contract.')
  console.log('')
  yesno.ask('Are you sure you want to continue?', false, function (ok) {
    if (ok) {
      console.log('Transferring ownership...')
      crowdsaleInstance.transferOwnership(newOwner, { gasPrice: 21000000000, gas: 100000, from: '0x8a2b891bb2062026f28a3905dad4fdaaa3515074' })

      process.exit(0)
    } else {
      console.log('Exiting...')
      console.log('')
      process.exit(-1)
    }
  })
}
