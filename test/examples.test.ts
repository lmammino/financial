import { fv, pmt } from '../src/financial'

describe('Source code docs examples', () => {
  test('fv()', () => {
    expect(fv(0.05 / 12, 10 * 12, -100, -100)).toBeCloseTo(15692.928894335748, 6)
  })

  test('pmt()', () => {
    expect(pmt(0.075 / 12, 12 * 15, 200000)).toBeCloseTo(-1854.0247200054619, 6)
  })
})
