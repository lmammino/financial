import { assertEquals } from 'https://deno.land/std/assert/mod.ts'
import {
  fv,
  pmt,
  nper,
  ipmt,
  pv,
  irr,
  npv,
} from '../src/index.ts'

Deno.test('fv()', () => {
  assertEquals(fv(0.05 / 12, 10 * 12, -100, -100), 15692.928894335755)
})

Deno.test('pmt()', () => {
  assertEquals(pmt(0.075 / 12, 12 * 15, 200000), -1854.0247200054619)
})

Deno.test('nper()', () => {
  assertEquals(nper(0.07 / 12, -150, 8000), 64.07334877066185)
})

Deno.test('ipmt()', () => {
  const principal = 2500
  const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const ipmts = periods.map((per) =>
    ipmt(0.0824 / 12, per, 1 * 12, principal),
  )
  assertEquals(
    ipmts,
    [
      -17.166666666666668, -15.789337457350777, -14.402550587464257,
      -13.006241114404524, -11.600343649629737, -10.18479235559687,
      -8.759520942678298, -7.324462666057678, -5.879550322604295,
      -4.424716247725826, -2.9598923121998877, -1.4850099189833388,
    ],
  )
  const interestpd = ipmts.reduce((a, b) => a + b, 0)
  assertEquals(interestpd, -112.98308424136215)
})

Deno.test('pv()', () => {
  assertEquals(pv(0.05 / 12, 10 * 12, -100, 15692.93), -100.00067131625376)
})

Deno.test('irr()', () => {
  assertEquals(irr([-100, 39, 59, 55, 20]), 0.2809484211599611)
  assertEquals(irr([-100, 0, 0, 74]), -0.09549583034897252)
  assertEquals(irr([-100, 100, 0, -7]), -0.08329966618495904)
  assertEquals(irr([-100, 100, 0, 7]), 0.06205848562992961)
  assertEquals(irr([-5, 10.5, 1, -8, 1]), 0.08859833852439172)
})

Deno.test('npv()', () => {
  const rate = 0.08
  const cashflows = [-40_000, 5000, 8000, 12000, 30000]
  assertEquals(npv(rate, cashflows), 3065.2226681795255)

  const initialCashflow = cashflows[0]
  cashflows[0] = 0
  assertEquals(npv(rate, cashflows) + initialCashflow, 3065.222668179529)
})
