/* global web3 */
function fastForward (seconds) {
  return new Promise(function (resolve, reject) {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [seconds],
      id: new Date().getTime()
    }, (error, result) => error ? reject(error) : resolve(result.result))
  })
}

module.exports = {
  // Recursively mine blocks
  fastForward: function (seconds) {
    return fastForward(seconds)
  }
}
