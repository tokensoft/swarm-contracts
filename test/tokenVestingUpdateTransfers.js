/* global artifacts, it, assert, contract, web3 */
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')

var fastForwardTime = require('./helpers/fastForwardTime')
const assertJump = require('./helpers/assertJump')

contract('Swarm Token Update Vesting params', async (accounts) => {
  it('should not allow non-owner to update params', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    await token.mint(accounts[2], 80000000000)
    await token.finishMinting()

     // First one should fail
    try {
      await token.setVestingParams(500, 500, 500, {from: accounts[2]})
      assert.fail('Should not allow non-owner to update')
    } catch (error) {
      assertJump(error)
    }

    // Owner should be able to change
    await token.setVestingParams(500, 500, 500)
  })

  it('should follow vesting schedule according to updated block time', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Mint tokens
    await token.mint(accounts[2], 80000000000)

    let testTransferAmt = 80000000000 / 4

    // Finish minting to start
    await token.finishMinting()

    // Update to 4 vesting periods
    let newPeriods = 4
    let newVestPeriodTime = 10 * 24 * 60 * 60 // 10 days
    let newStart = web3.eth.getBlock(web3.eth.blockNumber).timestamp + newVestPeriodTime
    await token.setVestingParams(newStart, newPeriods, newVestPeriodTime)

    // Verify the params have been updated
    assert.equal(await token.vestingTotalPeriods(), newPeriods)
    assert.equal(await token.vestingPeriodTime(), newVestPeriodTime)
    assert.equal(await token.vestingStartTime(), newStart)

    let account1 = accounts[2]
    let vested = await token.vestedBalanceOf(account1)
    assert.equal(vested, 0, 'Vesting has not started yet')

    // Fast forward to start of vesting
    await fastForwardTime.fastForward(newVestPeriodTime)

    // Spin through the 8 vesting periods
    for (let i = 0; i < newPeriods; i++) {
      // First one should fail since vest period hasn't been hit yet
      try {
        await token.transfer(accounts[3], testTransferAmt, { from: accounts[2] })
        console.log('Transfer should not be allowed before vesting')
        assert.fail()
      } catch (error) {
        assertJump(error)
      }

      // Update time to next vesting period
      await fastForwardTime.fastForward(newVestPeriodTime)

      // Second one should succeed
      await token.transfer(accounts[3], testTransferAmt, { from: accounts[2] })

      // Other account should freely send back to 2
      await token.transfer(accounts[2], testTransferAmt, { from: accounts[3] })

      // And 2 should be able to send it out again
      await token.transfer(accounts[3], testTransferAmt, { from: accounts[2] })

      // All vested tokens for 2 have been transferred.. any subsequent ones should fail
      try {
        await token.transfer(accounts[3], testTransferAmt, { from: accounts[2] })
        assert.fail()
      } catch (error) {
        assertJump(error)
      }
    }
  })
})
