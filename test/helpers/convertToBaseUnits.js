/* global web3 */
module.exports = function (amount) {
  return web3.toWei(amount, 'ether')
}
