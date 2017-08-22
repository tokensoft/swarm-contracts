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