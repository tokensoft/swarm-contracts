/* global artifacts, it, assert, contract */
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')

contract('Swarm Token Init', async (accounts) => {
  it('initial properties should be set', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    assert.equal(await token.name(), 'Swarm Fund Token', 'Name set')
    assert.equal(await token.symbol(), 'SWM', 'Symbol set')
    assert.equal(await token.decimals(), 18, 'Decimals set')
    assert.equal(await token.tokenFactory(), factory.address, 'Factory is set')
    assert.equal(await token.transfersEnabled(), true, 'transfers are enabled on parent token')
    assert.equal(await token.vestingStartTime(), 0, 'Vesting not started')
    assert.equal(await token.vestingPeriodTime(), 42 * 24 * 60 * 60, '42 days in seconds')
    assert.equal(await token.vestingTotalPeriods(), 8, 'Vesting periods should by 8')
    assert.equal(await token.mintingFinished(), false, 'Minting should not be finished at the start')
    assert.equal(await token.controller(), accounts[0], 'Creating account is owner')
  })
})
