import * as f from '../src/'

describe('Source code docs examples', () => {
  test('fv()', () => {
    expect(f.fv(0.05 / 12, 10 * 12, -100, -100)).toBeCloseTo(15692.928894335748, 6)
  })

  test('pmt()', () => {
    expect(f.pmt(0.075 / 12, 12 * 15, 200000)).toBeCloseTo(-1854.0247200054619, 6)
  })

  test('nper()', () => {
    expect(f.nper(0.07 / 12, -150, 8000)).toBeCloseTo(64.07334877066185, 6)
  })
})
