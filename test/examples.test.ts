import { assert, describe, it } from 'poku'
import { fv, ipmt, irr, nper, npv, pmt, pv } from '../src/index.ts'
import { assertEqualApprox } from './utils.ts'

describe('Source code docs examples', async () => {
  await it('fv()', () => {
    assertEqualApprox(fv(0.05 / 12, 10 * 12, -100, -100), 15692.928894335748)
  })

  await it('pmt()', () => {
    assertEqualApprox(pmt(0.075 / 12, 12 * 15, 200000), -1854.0247200054619)
  })

  await it('nper()', () => {
    assertEqualApprox(nper(0.07 / 12, -150, 8000), 64.07334877066185)
  })

  await it('ipmt()', () => {
    const principal = 2500
    const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const ipmts = periods.map((per) =>
      ipmt(0.0824 / 12, per, 1 * 12, principal),
    )
    assert.deepEqual(
      ipmts,
      [
        -17.166666666666668, -15.789337457350777, -14.402550587464257,
        -13.006241114404524, -11.600343649629737, -10.18479235559687,
        -8.759520942678298, -7.324462666057678, -5.879550322604295,
        -4.424716247725826, -2.9598923121998877, -1.4850099189833388,
      ],
    )
    const interestpd = ipmts.reduce((a, b) => a + b, 0)
    assertEqualApprox(interestpd, -112.98308424136215)
  })

  await it('pv()', () => {
    assertEqualApprox(
      pv(0.05 / 12, 10 * 12, -100, 15692.93),
      -100.00067131625819,
    )
  })

  await it('irr()', () => {
    assertEqualApprox(irr([-100, 39, 59, 55, 20]), 0.2809484)
    assertEqualApprox(irr([-100, 0, 0, 74]), -0.0954958)
    assertEqualApprox(irr([-100, 100, 0, -7]), -0.0833)
    assertEqualApprox(irr([-100, 100, 0, 7]), 0.0620584)
    assertEqualApprox(irr([-5, 10.5, 1, -8, 1]), 0.088598)
  })

  await it('npv()', () => {
    const rate = 0.08
    const cashflows = [-40_000, 5000, 8000, 12000, 30000]
    assertEqualApprox(npv(rate, cashflows), 3065.22266817)

    const initialCashflow = cashflows[0]
    cashflows[0] = 0
    assertEqualApprox(npv(rate, cashflows) + initialCashflow, 3065.22266817)
  })
})
