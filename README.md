# Swarm.Fund Token Sale

This repo defines the contracts used in the Swarm.Fund token sale.  The contracts should allow a token sale to be conducted according to the requirements in the [White Paper](http://sites.swarm.fund/whitepapers/Cooperative-Ownership-Platform-for-Real-Assets.pdf).

## Truffle Framework

The current version of the [Truffle Framework](https://github.com/trufflesuite/truffle) being used is `3.4.6`.  This version of Truffle supports the solidity compiler version `v0.4.13`.

## Open Zeppelin

Crowdsale contracts are based on [Open Zeppelin](https://github.com/OpenZeppelin/zeppelin-solidity) version `1.2.0`.  This is extended to allow a dynamic pricing algorithm as described in the white paper and to also work with the Minime token.

## Multisig wallet

Source contract is from [Consensys Multisig Wallet](https://github.com/ConsenSys/MultiSigWallet/blob/master/contracts/solidity/MultiSigWallet.sol).  This is often referred to as the `Gnosis Multisig Wallet` as this is the group from where it originated.

Git Hash: `6d743e927e15d9f5b0da9eb0b7b2b11b857ba80c`

## Minime Token

The `Minime Token Contract` is is based on the [Giveth Repo](https://github.com/Giveth/minime).  This contract was used in the [Aragon Project](https://github.com/aragon/aragon-network-token).  This contract is extended to support a vesting schedule as defined in the white paper.

Git Hash: `815699db3e31dca12362baad0f386c99f213d129`



## Testnet

Contracts were deployed to Ropsten:

```
Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x51fc65e51256b157e146374b507fbe38e47d2f9fbaba8e89ec41699a25cb2da0
  Migrations: 0x6ef0b136802e608a3ed8b157240e1726e4b66a62
Saving successful migration to network...
  ... 0x68f42ef4f1af214ede2758f51ce56c6b74fb1d735457c79c81527607c8bd978e
Saving artifacts...
Running migration: 2_deploy_crowdsale.js
  Running step...
  Deploying MiniMeTokenFactory...
  ... 0x2715eb8eedb96ac4bd3a49e42b7be0af52c1b128858ade2564f1f5b888df756c
  MiniMeTokenFactory: 0x5260bb5d6e52dbda7061d721fe2b517bccf43ee5
  Deploying SwarmToken...
  ... 0xf460b926e18c8df0f16851cddf763173d2f4f378807ac512e0c3e7ccc4687b70
  SwarmToken: 0x1254d5bdf4232426cf039ae21f2f132d13765042
  Deploying SwarmCrowdsale...
  ... 0x48902268e6e5ed3cc8bcb3f8ae993e20b212811ada2042acfc783a67a858595c
  SwarmCrowdsale: 0x99e9a7c8d76d6dc4c9e6018c2f730822ec1a4411
Changing controller address for token
  ... 0xbbbfa0ee2c6b277c40103a22f17a1879cd8a3f29aeac4f11a1da398395a29ae6
Initializing crowdsale
  ... 0x5c2d09b4efdd36c95cba7f9a807ccf07ddb3ca0542869f31698e487a6c3eca6e
Saving successful migration to network...
  ... 0x5106c47ea61e895886d1d60291379c33766464f24d3019a130699fe0760b14a8
```