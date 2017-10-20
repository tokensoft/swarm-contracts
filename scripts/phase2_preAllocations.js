const Web3 = require('web3')
const BigNumber = require('bignumber.js')
var yesno = require('yesno')

const allocationsList = [
  { address: '0x8bf7b2d536d286b9c5ad9d99f608e9e214de63f0', amt: new BigNumber('20187298.95562250').mul(new BigNumber(10).toPower(18)) },
  { address: '0x8bf7b2d536d286b9c5ad9d99f608e9e214de63f0', amt: new BigNumber('6650000').mul(new BigNumber(10).toPower(18)) }
]

module.exports = async function (callback) {
  console.log('Loading Contract')
  let crowdSaleDef = require('../build/contracts/SwarmCrowdsale.json')
  let crowdsaleABI = crowdSaleDef.abi
  let crowdSaleContract = web3.eth.contract(crowdsaleABI)
  let crowdsaleInstance = crowdSaleContract.at('XXX')

  // To be run for distribution
  console.log('Preparing Allocation list...')
  console.log('')
  let total = new BigNumber(0)

  for (let i = 0; i < allocationsList.length; i++) {
    // Double check the address
    if (!web3.isAddress(allocationsList[i].address)) {
      console.error('ERROR: Invalid address detected: ' + allocationsList[i].address)
      console.log('')
      process.exit(-1)
    }

    // Add up the total
    total = total.add(allocationsList[i].amt)
  }

  console.log('You are about to mint ' + allocationsList.length + ' addresses with a total of ' + total.div(new BigNumber(10).toPower(18)).toFormat() + ' tokens.')
  console.log('')
  yesno.ask('Are you sure you want to continue?', false, function (ok) {
    if (ok) {
      console.log('Minting tokens...')
      for (let i = 0; i < allocationsList.length; i++) {
        console.log('Minting: ' + allocationsList[i].address + ' - ' + allocationsList[i].amt.div(new BigNumber(10).toPower(18)).toFormat())
        crowdsaleInstance.presaleMint(allocationsList[i].address, allocationsList[i].amt, { gasPrice: 21000000000, gas: 150000, from: 'XXX' })
      }

      process.exit(0)
    } else {
      console.log('Exiting...')
      console.log('')
      process.exit(-1)
    }
  })
}
