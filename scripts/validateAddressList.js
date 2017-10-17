var BigNumber = require('bignumber.js')

let allocationsList = [
  { address: '0x3a4adbd7ace9935bf991d7cf9a4cd154d57bd320', amt: new BigNumber('190000').mul(new BigNumber(10).toPower(18)) },
  { address: '0xf66fe29ad1e87104a8816ad1a8427976d83cb033', amt: new BigNumber('1000000').mul(new BigNumber(10).toPower(18)) },
  { address: '0xf93d13fa0469ea8fb44a8220a34d8cfd15a35251', amt: new BigNumber('9500').mul(new BigNumber(10).toPower(18)) },
  { address: '0x44dbacd6b5cdc7d43cc2519da33cca2f99e3c4ab', amt: new BigNumber('400000').mul(new BigNumber(10).toPower(18)) },
  { address: '0xbebfb97735b12dc836edd8895e5fe4bc132cf99a', amt: new BigNumber('150000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x79e5de803e580ae4811c6ef911efd4bd52895a75', amt: new BigNumber('100000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x4d5b73507660f2df201b43ad9ae729286b2ebab2', amt: new BigNumber('10000').mul(new BigNumber(10).toPower(18)) },
  { address: '0xc62b603e011cf69d729a3a0a77f132ee4ad36239', amt: new BigNumber('12500').mul(new BigNumber(10).toPower(18)) },
  { address: '0x5ff38eb59b5131fe3b0781ca34c49646ee17a74f', amt: new BigNumber('35710').mul(new BigNumber(10).toPower(18)) },
  { address: '0x1697c3c6b4359124c1b2a8fb85114c67b6491965', amt: new BigNumber('1000000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x887dbacd9a0e58b46065f93cc1f82a52defdb979', amt: new BigNumber('1000000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x29d1ba46c4502a640bd8e02dd2fd3c87b0b56f05', amt: new BigNumber('125000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x00917c372fa5e0c7fe8ecc04ceea2670e18d3786', amt: new BigNumber('2500').mul(new BigNumber(10).toPower(18)) },
  { address: '0xb16fbf045765aa376c8ae1f3c7744982783b3908', amt: new BigNumber('251').mul(new BigNumber(10).toPower(18)) },
  { address: '0xf02d417c8c6736dbc7eb089dc6738b950c2f444e', amt: new BigNumber('114417').mul(new BigNumber(10).toPower(18)) },
  { address: '0x16e352df52389c0511d81d3e0c416108619bf4ad', amt: new BigNumber('521').mul(new BigNumber(10).toPower(18)) },
  { address: '0x00208f5e88146ccd9a439e20af621ea958ff7c1b', amt: new BigNumber('48903').mul(new BigNumber(10).toPower(18)) },
  { address: '0x1e481777224bf04ae1a9c02ac2a294ed54d06199', amt: new BigNumber('2500').mul(new BigNumber(10).toPower(18)) },
  { address: '0xb6dc48e8583c8c6e320daf918cadef65f2d85b46', amt: new BigNumber('114417').mul(new BigNumber(10).toPower(18)) },
  { address: '0xe223771699665bcb0aaf7930277c35d3dec573af', amt: new BigNumber('125000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x364b503b0e86b20b7ac1484c247de50f10dfd8cf', amt: new BigNumber('125000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x1b977f3ffeb679c0056f6fcee879637ed6ee4d93', amt: new BigNumber('9986').mul(new BigNumber(10).toPower(18)) },
  { address: '0xf50fa0fe35854e92f691e031f373069671098dc2', amt: new BigNumber('7369').mul(new BigNumber(10).toPower(18)) },
  { address: '0xfc7d5eaaaf869d8ee0b17c61b0f6f83bbac2fbc2', amt: new BigNumber('2996').mul(new BigNumber(10).toPower(18)) },
  { address: '0xe83efc57d9c487acc55a7b62896da43928e64c3e', amt: new BigNumber('66667').mul(new BigNumber(10).toPower(18)) },
  { address: '0xcb2b24c5c70444659e0764ad5ee0ca90ff32559a', amt: new BigNumber('22251').mul(new BigNumber(10).toPower(18)) },
  { address: '0xb599ff1910a23ed2e520259c360a4a6d4986f00c', amt: new BigNumber('33333').mul(new BigNumber(10).toPower(18)) },
  { address: '0xfd5955bf412b7537873cbb77eb1e39871e20e142', amt: new BigNumber('66667').mul(new BigNumber(10).toPower(18)) },
  { address: '0x34aaf201b069d139e7c4062e65b0c964301bcdfc', amt: new BigNumber('4097').mul(new BigNumber(10).toPower(18)) },
  { address: '0xd2f334cbf3ad1669fb272f17bc1eb5b89cc5d878', amt: new BigNumber('39691').mul(new BigNumber(10).toPower(18)) },
  { address: '0x017fc689bfd56313c39ea15c9d28a753a2b05182', amt: new BigNumber('58799').mul(new BigNumber(10).toPower(18)) },
  { address: '0xd0c41588b27e64576dda4e6a08452c59f5a2b2dd', amt: new BigNumber('33333').mul(new BigNumber(10).toPower(18)) },
  { address: '0x640370126072f6b890d4ca2e893103e9363dbe8b', amt: new BigNumber('33333').mul(new BigNumber(10).toPower(18)) },
  { address: '0xbc1bcd39952baa120bb0c12ba74ed8422f7472b4', amt: new BigNumber('25000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x44dbacd6b5cdc7d43cc2519da33cca2f99e3c4ab', amt: new BigNumber('55000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x9504fdf38a1c6b8531de479aaca0553947345695', amt: new BigNumber('120000').mul(new BigNumber(10).toPower(18)) },
  { address: '0xfa6f3716829f849f7919014bd0fe15bf8d3d45d4', amt: new BigNumber('175000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x11c709fac6452ff20ac609326868c1a96d00ed93', amt: new BigNumber('15000').mul(new BigNumber(10).toPower(18)) },
  { address: '0xfb658f93331e890cef6275c55db18504c18f49fc', amt: new BigNumber('1000000').mul(new BigNumber(10).toPower(18)) },
  { address: '0xff23728a1baebab52c6bc58c46dd608cd3edf91d', amt: new BigNumber('1000000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x4ca8845dac463a0e93dd08f190f0350c3ea3fe48', amt: new BigNumber('100000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x695d0ce8a1f3acb5c122716e7e974b1539160fcf', amt: new BigNumber('100000').mul(new BigNumber(10).toPower(18)) },
  { address: '0x8a2b891bB2062026F28a3905dAD4FdAaa3515074', amt: new BigNumber('63564').mul(new BigNumber(10).toPower(18)) },
  { address: '0x30a6b2e126e30504e0083e27e0e9c1c8f6fa472a', amt: new BigNumber('333333').mul(new BigNumber(10).toPower(18)) },
  { address: '0x4629b8563200b3c593f14e2b4088bb7cb5e398ed', amt: new BigNumber('3252').mul(new BigNumber(10).toPower(18)) },
  { address: '0x4d49b62c823601584b6be3c12a7105154badccc6', amt: new BigNumber('15000').mul(new BigNumber(10).toPower(18)) }
]

module.exports = async function (callback) {
  console.log('')
  console.log('Checking for valid addresses...')

  for (let i = 0; i < allocationsList.length; i++) {
    if (!web3.isAddress(allocationsList[i].address)) {
      console.error('ERROR: Invalid address detected: ' + allocationsList[i].address)
      console.log('')
      process.exit(-1)
    }
  }

  console.log('All ' + allocationsList.length + ' addresses have passed validation.')
  console.log('')
}
