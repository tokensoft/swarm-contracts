/* global artifacts, it, assert, contract, web3 */
var MultiSigWallet = artifacts.require('./multisig/MultiSigWallet.sol')

contract('MultiSigWallet', async (accounts) => {
  it('should be deployed with expected vals', async () => {
    let wallet = await MultiSigWallet.deployed()

    let owners = await wallet.getOwners()

    assert.equal(await wallet.required(), 2, 'testing wallet should have 2 required signer')
    assert.equal(owners[0], accounts[0], 'testing wallet should have account[0] as an owner')
    assert.equal(owners[1], accounts[1], 'testing wallet should have account[0] as an owner')
    assert.equal(owners[2], accounts[2], 'testing wallet should have account[0] as an owner')
  })

  it('should require 2 approvals', async () => {
    let wallet = await MultiSigWallet.deployed()

    // Save off value in acct 5
    let acct5Balance = await web3.eth.getBalance(accounts[5])

    // Send some ETH to the multisig
    await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 200000})

    // Have account 0 submit a transaction to send to acct 5
    await wallet.submitTransaction(accounts[5], 100000, 0)

    // Save over the last submitted trx id
    let trxId = await wallet.transactionCount() - 1

    // Verify it wasn't actually sent yet
    let tempBalance = await web3.eth.getBalance(accounts[5])
    assert(acct5Balance, tempBalance, "Submitting a trx shouldn't send until second approval")

    // Allow second account to approve it
    await wallet.confirmTransaction(trxId, {from: accounts[1]})

    // Verify the amount was sent
    tempBalance = await web3.eth.getBalance(accounts[5])
    assert(acct5Balance + 100000, tempBalance, 'Transaction should have been triggered')
  })
})
