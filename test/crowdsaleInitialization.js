/* global web3, artifacts, it, assert, contract */
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')

contract('Swarm Crowd Sale Init', async (accounts) => {
  it('initial properties should be set', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let endTime = startTime + 500

    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, 300, accounts[5], token.address, 1000)

    assert.equal(await crowdsale.initialized(), false, 'Crowdsale should not be initialized')
    assert.equal(await crowdsale.baseTokensSold(), 1000, 'No tokens should show sold at start')
    assert.equal(await crowdsale.isFinalized(), false, 'Should not be finalized at start')

    assert.equal(await crowdsale.startTime(), startTime, 'deployed with start block')
    assert.equal(await crowdsale.endTime(), endTime, 'Deployed with end block')
    assert.equal(await crowdsale.rate(), 300, 'Deployed with rate')
    assert.equal(await crowdsale.weiRaised(), 0, 'No sold at init')

    assert.equal(await crowdsale.hasEnded(), false, 'Not ended at start')
  })

  it('initial allocations should work', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Don't care about start time...
    let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100000
    let endTime = startTime + 500

    let crowdsale = await SwarmCrowdsale.new(startTime, endTime, 300, accounts[0], token.address, 0)

    await token.changeController(crowdsale.address)

    // Test individual presale mints
    await crowdsale.presaleMint(accounts[3], 1000000000)
    await crowdsale.presaleMint(accounts[4], 2000000000)
    assert.equal(await token.balanceOf(accounts[3]), 1000000000)
    assert.equal(await token.balanceOf(accounts[4]), 2000000000)

    // Test multi mints
    let addresses = [
      accounts[5],
      accounts[6],
      accounts[7],
      accounts[8],
      accounts[9]
    ]

    let amounts = [
      2000000000,
      3000000000,
      4000000000,
      5000000000,
      6000000000
    ]

    await crowdsale.multiPresaleMint(addresses, amounts)

    assert.equal(await token.balanceOf(accounts[5]), 2000000000)
    assert.equal(await token.balanceOf(accounts[6]), 3000000000)
    assert.equal(await token.balanceOf(accounts[7]), 4000000000)
    assert.equal(await token.balanceOf(accounts[8]), 5000000000)
    assert.equal(await token.balanceOf(accounts[9]), 6000000000)
  })
})
