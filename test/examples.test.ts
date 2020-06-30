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

  test('ipmt()', () => {
    const principal = 2500
    const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const ipmts = periods.map((per) => f.ipmt(0.0824 / 12, per, 1 * 12, principal))
    expect(ipmts).toEqual([
      -17.166666666666668,
      -15.789337457350777,
      -14.402550587464257,
      -13.006241114404524,
      -11.600343649629737,
      -10.18479235559687,
      -8.759520942678298,
      -7.324462666057678,
      -5.879550322604295,
      -4.424716247725826,
      -2.9598923121998877,
      -1.4850099189833388
    ])
    const interestpd = ipmts.reduce((a, b) => a + b, 0)
    expect(interestpd).toBeCloseTo(-112.98308424136215, 6)
  })
})
