/* global artifacts, it, assert, contract */
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')
var PlaceHolderToken = artifacts.require('./token/PlaceHolderToken.sol')

const SECONDS_IN_A_DAY = 86400

function days (numDays) {
  return numDays * SECONDS_IN_A_DAY
}

let startTime = 1000

let expectedVestingPeriods = [
  { start: startTime, current: startTime, expected: 0, note: 'At start,vesting periods passed should be 0' },
  { start: startTime, current: startTime + days(1), expected: 0, note: 'One day in should have 0 vesting periods completed' },
  { start: startTime, current: startTime + days(10), expected: 0, note: '10 days in should have 0 vesting periods completed' },
  { start: startTime, current: startTime + days(41), expected: 0, note: '41 days in should have 0 vesting periods completed' },
  { start: startTime, current: startTime + days(42), expected: 1, note: '42 days in should have 1 vesting periods completed' },
  { start: startTime, current: startTime + days(60), expected: 1, note: '60 days in should have 1 vesting periods completed' },
  { start: startTime, current: startTime + days(83), expected: 1, note: '83 days in should have 1 vesting periods completed' },
  { start: startTime, current: startTime + days(84), expected: 2, note: '84 days in should have 2 vesting periods completed' },
  { start: startTime, current: startTime + days(90), expected: 2, note: '90 days in should have 2 vesting periods completed' },
  { start: startTime, current: startTime + days(125), expected: 2, note: '' },
  { start: startTime, current: startTime + days(126), expected: 3, note: '' },
  { start: startTime, current: startTime + days(150), expected: 3, note: '' },
  { start: startTime, current: startTime + days(167), expected: 3, note: '' },
  { start: startTime, current: startTime + days(168), expected: 4, note: '' },
  { start: startTime, current: startTime + days(210), expected: 5, note: '' },
  { start: startTime, current: startTime + days(252), expected: 6, note: '' },
  { start: startTime, current: startTime + days(294), expected: 7, note: '' },
  { start: startTime, current: startTime + days(336), expected: 8, note: '' },
  { start: startTime, current: startTime + days(378), expected: 9, note: '' }
]

// Simulate buy and hold 100000 tokens
let vestAmtNoAdded = [
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 100000 / 8, note: 'Second period, 1/8 should vest' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 12500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 12500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 25000, note: 'Third period, 1/4 should vest' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 25000, note: 'Third period, 1/4 should vest' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 25000, note: 'Third period, 1/4 should vest' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 37500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 37500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 37500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 50000, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 62500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 75000, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 87500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 100000, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 100000, note: '' }
]

// Simulate selling as soon as they become vested
let vestAmtWithSubtracted = [
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 12500, expected: 0, note: 'Spending tokens immediately after they are vested should reset balance to 0' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 12500, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 12500, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 25000, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 25000, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 25000, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 37500, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 37500, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 37500, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 50000, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 62500, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 75000, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 87500, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 100000, expected: 0, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 100000 - 100000, expected: 0, note: '' }
]

// Simulate buy and hold and add 2000000 as soon as tokens start trading plus some more later
let vestAmtWithAdded = [
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 100000, expected: 0, note: 'Until first period ends, no vested tokens' },
  { crowdSalePurchased: 100000, currentBalance: 2100000, expected: 2000000 + 100000 / 8, note: 'Second period, 1/8 should vest from original amount plus added amt' },
  { crowdSalePurchased: 100000, currentBalance: 2100000, expected: 2000000 + 12500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 2100000, expected: 2000000 + 12500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 2100000, expected: 2000000 + 25000, note: 'Third period, 1/4 of original should vest' },
  { crowdSalePurchased: 100000, currentBalance: 2100000, expected: 2000000 + 25000, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 2100000, expected: 2000000 + 25000, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 2100000, expected: 2000000 + 37500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 2100000, expected: 2000000 + 37500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 4100000, expected: 4000000 + 37500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 4100000, expected: 4000000 + 50000, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 4100000, expected: 4000000 + 62500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 4100000, expected: 4000000 + 75000, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 4100000, expected: 4000000 + 87500, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 4100000, expected: 4000000 + 100000, note: '' },
  { crowdSalePurchased: 100000, currentBalance: 4100000, expected: 4000000 + 100000, note: '' }
]

contract('Swarm Token Vesting', async (accounts) => {
  it('vesting periods increase every 42 days', async () => {
    let crowdsale = await SwarmCrowdsale.deployed()
    let tokenAddr = await crowdsale.token()
    let token = await PlaceHolderToken.at(tokenAddr)

    for (let i = 0; i < expectedVestingPeriods.length; i++) {
      // Build the values to check
      let record = expectedVestingPeriods[i]
      let numPeriods = await token.getVestingPeriodsCompleted(record.start, record.current)

      assert.equal(numPeriods.toNumber(), record.expected, record.note)
    }
  })

  it('vesting of initial coins should happen in step fashion', async () => {
    let crowdsale = await SwarmCrowdsale.deployed()
    let tokenAddr = await crowdsale.token()
    let token = await PlaceHolderToken.at(tokenAddr)

    for (let i = 0; i < vestAmtNoAdded.length; i++) {
      // Build the values to check
      let record = vestAmtNoAdded[i]
      let vestingTime = expectedVestingPeriods[i]
      let vestedAmount = await token.getVestedBalance(record.crowdSalePurchased, record.currentBalance, vestingTime.start, vestingTime.current)

      assert.equal(vestedAmount.toNumber(), record.expected, record.note)
    }
  })

  it('vesting of initial coins should happen in step fashion and account for them being immediately transferred out', async () => {
    let crowdsale = await SwarmCrowdsale.deployed()
    let tokenAddr = await crowdsale.token()
    let token = await PlaceHolderToken.at(tokenAddr)

    for (let i = 0; i < vestAmtWithSubtracted.length; i++) {
      // Build the values to check
      let record = vestAmtWithSubtracted[i]
      let vestingTime = expectedVestingPeriods[i]
      let vestedAmount = await token.getVestedBalance(record.crowdSalePurchased, record.currentBalance, vestingTime.start, vestingTime.current)

      assert.equal(vestedAmount.toNumber(), record.expected, record.note)
    }
  })

  it('vesting of initial coins should happen in step fashion with addition of tokens later', async () => {
    let crowdsale = await SwarmCrowdsale.deployed()
    let tokenAddr = await crowdsale.token()
    let token = await PlaceHolderToken.at(tokenAddr)

    for (let i = 0; i < vestAmtWithAdded.length; i++) {
      // Build the values to check
      let record = vestAmtWithAdded[i]
      let vestingTime = expectedVestingPeriods[i]
      let vestedAmount = await token.getVestedBalance(record.crowdSalePurchased, record.currentBalance, vestingTime.start, vestingTime.current)

      assert.equal(vestedAmount.toNumber(), record.expected, record.note)
    }
  })
})
