/* global artifacts, it, assert, contract */
var SwarmToken = artifacts.require('./token/SwarmToken.sol')
var MiniMeTokenFactory = artifacts.require('./token/MiniMeTokenFactory.sol')

const assertJump = require('./helpers/assertJump')

contract('Swarm Token Minting', async (accounts) => {
  it('should mint tokens', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Mint some tokens for accounts
    await token.mint(accounts[2], 10000000000)
    await token.mint(accounts[3], 10000000000)
    await token.mint(accounts[4], 10000000000)

    let amt2 = await token.balanceOf(accounts[2])
    let amt3 = await token.balanceOf(accounts[3])
    let amt4 = await token.balanceOf(accounts[4])

    assert.equal(amt2.valueOf(), 10000000000, 'Balance should show minted tokens')
    assert.equal(amt3.valueOf(), 10000000000, 'Balance should show minted tokens')
    assert.equal(amt4.valueOf(), 10000000000, 'Balance should show minted tokens')
  })

  it('should handle multiple minting of tokens to one account', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Mint some tokens for 1 account
    await token.mint(accounts[2], 10000000000)
    await token.mint(accounts[2], 10000000000)
    await token.mint(accounts[2], 10000000000)

    let amt2 = await token.balanceOf(accounts[2])

    assert.equal(amt2.valueOf(), 10000000000 + 10000000000 + 10000000000, 'Balance should show minted tokens')
  })

  it('should handle accounts without minted tokens', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    let amt2 = await token.balanceOf(accounts[2])

    assert.equal(amt2.valueOf(), 0, 'Balance should show 0 minted tokens')
  })

  it('should finish', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Mint some tokens
    await token.mint(accounts[2], 10000000000)

    // Finsih minting
    await token.finishMinting()

    assert.equal(await token.mintingFinished(), true, 'Finish minting should get set')
  })

  it('should fail to mint from non-owner acct', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    try {
      await token.mint(accounts[2], 10000000000, {from: accounts[5]})
      assert.fail()
    } catch (error) {
      assertJump(error)
    }
  })

  it('should fail to mint after finished', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Finsih minting
    await token.finishMinting()

    try {
      await token.mint(accounts[2], 10000000000)
      assert.fail()
    } catch (error) {
      assertJump(error)
    }
  })

  it('should fail to call finish mint after finished', async () => {
    let factory = await MiniMeTokenFactory.deployed()
    let token = await SwarmToken.new(factory.address)

    // Finsih minting
    await token.finishMinting()

    try {
      await token.finishMinting()
      assert.fail()
    } catch (error) {
      assertJump(error)
    }
  })
})
