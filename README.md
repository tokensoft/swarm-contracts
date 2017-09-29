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
  Replacing Migrations...
  ... 0xf97748c46624aaa2545607a1580a79baa89557774d666dc0259625f5852c8a5e
  Migrations: 0xf41ad2379163892aa1db4979c074034cc00b27fc
Saving successful migration to network...
  ... 0x9dd83a183f47b8cf4a7675b61fe3a6790894635f45b690b840a90004c2a14ae1
Saving artifacts...
Running migration: 2_deploy_crowdsale.js
  Running step...
  Deploying MultiSigWallet...
  ... 0x5604c22a353f787a92dc8884e20eec123c88d588266ab487a7918c536f7887c0
  MultiSigWallet: 0xfddc9a33003b08353c2b9a1dc9b19f39dbe4fee8
  Deploying MiniMeTokenFactory...
  ... 0x00b055ab8dbdee29f0268d1101ea7e8df594864963c468b0325ae14a2213c07d
  MiniMeTokenFactory: 0x8cbf09dad317e7c8e08080653ddedc60d923adda
  Deploying SwarmToken...
  ... 0x9b4843ada98f8c8b45f6a525166021c4bb326c0b3f4eb9963ec56eda5c4279a3
  SwarmToken: 0x1f30905dc83c431a90465e3f8946f650d59b9397
  Deploying SwarmCrowdsale...
  ... 0x2b0000280e46a3db2508adecced20ac35e88171502cdd90837ce9ff603df58e0
  SwarmCrowdsale: 0xd9c9481949dfee53fe15c35696d6fcb5d193d168
Changing controller address for token
  ... 0x9c981d6c098fdc4a5c568c82eac4c2aead02925a6a46926ee2bf4326329fcf0a
Saving successful migration to network...
  ... 0xfa5c62b58f407843cd783305d4dedfe2dbaec2a0b8f6d5141d5e55f128dfcff9
Saving artifacts...
```