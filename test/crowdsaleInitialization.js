/* global web3, artifacts, it, assert, contract */
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')

function convertToBaseUnits (amount) {
  return web3.toWei(amount, 'ether')
}

contract('Swarm Crowd Sale Init', async (accounts) => {
  it('initial properties should be set', async () => {
    let crowdsale = await SwarmCrowdsale.deployed()
    let tokenAddr = await crowdsale.token()
    let token = await SwarmToken.at(tokenAddr)

    // Token balance on sample pre-allocation should be set
    let amt = await token.balanceOf('0x00e2b3204f29ab45d5fd074ff02ade098fbc381d42')
    assert.equal(amt.valueOf(), convertToBaseUnits(100), 'Balance should show pre-allocated tokens')

    assert.equal(await crowdsale.initialized(), true, 'Crowdsale should be initialized after deployment scripts')
    assert.equal(await crowdsale.baseTokensSold(), 0, 'No tokens should show sold at start')
    assert.equal(await crowdsale.isFinalized(), false, 'Should not be finalized at start')

    assert.equal(await crowdsale.startBlock(), 20, 'deployed with start block')
    assert.equal(await crowdsale.endBlock(), 40, 'Deployed with end block')
    assert.equal(await crowdsale.rate(), 300, 'Deployed with rate')
    assert.equal(await crowdsale.weiRaised(), 0, 'No sold at init')

    assert.equal(await crowdsale.hasEnded(), false, 'Not ended at start')
  })
})
