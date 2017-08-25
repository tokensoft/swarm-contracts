/* global artifacts, it, assert, contract */
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')

var fastForwardTime = require('./helpers/fastForwardTime')
const assertJump = require('./helpers/assertJump')

let vestPeriod = 42 * 24 * 60 * 60

contract('Swarm Token Vesting transfers', async (accounts) => {
  it('should allow full transfer after vest period', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    await token.mint(accounts[2], 80000000000)
    await token.finishMinting()

     // First one should fail
    try {
      await token.transfer(accounts[3], 80000000000, { from: accounts[2] })
      console.log('Transfer should not be allowed before vesting')
      assert.fail()
    } catch (error) {
      assertJump(error)
    }

    // Update block time end of vesting period
    await fastForwardTime.fastForward(vestPeriod * 8)

    // Second one should work
    await token.transfer(accounts[3], 80000000000, { from: accounts[2] })
  })

  it('should follow vesting schedule according to block time', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Mint tokens
    await token.mint(accounts[2], 80000000000)

    let testTransferAmt = 80000000000 / 8

    // Finish minting to start
    await token.finishMinting()

    let vestedBalance = await token.vestedBalanceOf(accounts[2])
    assert.equal(vestedBalance.toNumber(), 0, 'Vested balance should be 0')

    // Spin through the 8 vesting periods
    for (let i = 0; i < 8; i++) {
      // First one should fail since vest period hasn't been hit yet
      try {
        await token.transfer(accounts[3], testTransferAmt, { from: accounts[2] })
        console.log('Transfer should not be allowed before vesting')
        assert.fail()
      } catch (error) {
        assertJump(error)
      }

      // Update block time to next vesting period
      await fastForwardTime.fastForward(vestPeriod)

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
