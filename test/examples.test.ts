import {
  fv,
  pmt,
  nper,
  ipmt,
  pv,
  irr,
  npv,
} from '../src/index.ts'

describe('Source code docs examples', () => {
  test('fv()', () => {
    expect(fv(0.05 / 12, 10 * 12, -100, -100)).toBeCloseTo(
      15692.928894335748,
      6,
    )
  })

  test('pmt()', () => {
    expect(pmt(0.075 / 12, 12 * 15, 200000)).toBeCloseTo(
      -1854.0247200054619,
      6,
    )
  })

  test('nper()', () => {
    expect(nper(0.07 / 12, -150, 8000)).toBeCloseTo(64.07334877066185, 6)
  })

  test('ipmt()', () => {
    const principal = 2500
    const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const ipmts = periods.map((per) =>
      ipmt(0.0824 / 12, per, 1 * 12, principal),
    )
    expect(ipmts).toEqual([
      -17.166666666666668, -15.789337457350777, -14.402550587464257,
      -13.006241114404524, -11.600343649629737, -10.18479235559687,
      -8.759520942678298, -7.324462666057678, -5.879550322604295,
      -4.424716247725826, -2.9598923121998877, -1.4850099189833388,
    ])
    const interestpd = ipmts.reduce((a, b) => a + b, 0)
    expect(interestpd).toBeCloseTo(-112.98308424136215, 6)
  })

  test('pv()', () => {
    expect(pv(0.05 / 12, 10 * 12, -100, 15692.93)).toBeCloseTo(
      -100.00067131625819,
      6,
    )
  })

  test('irr()', () => {
    expect(irr([-100, 39, 59, 55, 20])).toBeCloseTo(0.2809484, 6)
    expect(irr([-100, 0, 0, 74])).toBeCloseTo(-0.0954958, 6)
    expect(irr([-100, 100, 0, -7])).toBeCloseTo(-0.0833, 6)
    expect(irr([-100, 100, 0, 7])).toBeCloseTo(0.0620584, 6)
    expect(irr([-5, 10.5, 1, -8, 1])).toBeCloseTo(0.088598, 6)
  })

  test('npv()', () => {
    const rate = 0.08
    const cashflows = [-40_000, 5000, 8000, 12000, 30000]
    expect(npv(rate, cashflows)).toBeCloseTo(3065.22266817, 6)

    const initialCashflow = cashflows[0]
    cashflows[0] = 0
    expect(npv(rate, cashflows) + initialCashflow).toBeCloseTo(
      3065.22266817,
      6,
    )
  })
})
