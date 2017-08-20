/* global artifacts, it, assert, contract, web3 */
var SwarmCrowdsale = artifacts.require('./crowdsale/SwarmCrowdsale.sol')

function convertToBaseUnits (amount) {
  return web3.toWei(amount, 'ether')
}

contract('SwarmCrowdsale Pricing', async (accounts) => {
  it('Prices should match decreasing rate per ETH algo', async () => {
    let crowdsale = await SwarmCrowdsale.deployed()

    // NOTE: This assumes the initial price is 300 Tokens per ETH.
    // The rate decreases as more tokens are sold.
    // Each generation of tokens is 1m, before the price resets to a lower rate.
    let expectedRates = [
      { tokensAlreadySold: 0, expectedRate: 300, note: 'Starting price should be 300' },
      { tokensAlreadySold: 1000, expectedRate: 300, note: 'The first million tokens all sell for start price' },
      { tokensAlreadySold: 999999, expectedRate: 300, note: 'The 999,999th token should be sold for start price' },
      { tokensAlreadySold: 1000000, expectedRate: 200, note: 'The millionth token sold should have the price go up by 50%' },
      { tokensAlreadySold: 1500000, expectedRate: 200, note: '' },
      { tokensAlreadySold: 1999999, expectedRate: 200, note: '1,999,999 should be priced at second gen' },
      { tokensAlreadySold: 2000000, expectedRate: 163, note: '3rd generation should cut the rate by 33%' },
      { tokensAlreadySold: 2500000, expectedRate: 163, note: '' },
      { tokensAlreadySold: 2999999, expectedRate: 163, note: '' },
      { tokensAlreadySold: 3000000, expectedRate: 144, note: '4th generation should cut rate by 25%' },
      { tokensAlreadySold: 3500000, expectedRate: 144, note: '' },
      { tokensAlreadySold: 3999999, expectedRate: 144, note: '' },
      { tokensAlreadySold: 4000000, expectedRate: 131, note: '' },
      { tokensAlreadySold: 5000000, expectedRate: 122, note: '' },
      { tokensAlreadySold: 6000000, expectedRate: 115, note: '' },
      { tokensAlreadySold: 7000000, expectedRate: 110, note: '' },
      { tokensAlreadySold: 8000000, expectedRate: 106, note: '' },
      { tokensAlreadySold: 9000000, expectedRate: 102, note: '' },
      { tokensAlreadySold: 10000000, expectedRate: 99, note: '' },
      { tokensAlreadySold: 20000000, expectedRate: 82, note: '' },
      { tokensAlreadySold: 30000000, expectedRate: 74, note: '' },
      { tokensAlreadySold: 50000000, expectedRate: 66, note: '' },
      { tokensAlreadySold: 100000000, expectedRate: 57, note: '' },
      { tokensAlreadySold: 1000000000, expectedRate: 40, note: '' },
      { tokensAlreadySold: 10000000000, expectedRate: 30, note: '' }
    ]

    for (let i = 0; i < expectedRates.length; i++) {
      // Build the values to check
      let record = expectedRates[i]
      let amountSoldBaseUnits = convertToBaseUnits(record.tokensAlreadySold)
      let calculatedPrice = await crowdsale.getSaleRate(amountSoldBaseUnits)

      // Ensure they match expectations
      assert.equal(calculatedPrice.toNumber(), record.expectedRate, record.note)
    }
  })
})
