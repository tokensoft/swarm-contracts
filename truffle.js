module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      host: '',
      port: 8545,
      network_id: '3',
      from: '',
      gasPrice: 21000000000
    },
    livenet: {
      host: '',
      port: 8545,
      network_id: '1',
      from: '',
      gasPrice: 21000000000
    }
  }
}
