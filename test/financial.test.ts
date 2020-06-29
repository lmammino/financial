import { fv, pmt, nper, PaymentDueTime } from '../src/financial'

// Based on https://github.com/numpy/numpy-financial/blob/master/numpy_financial/tests/test_financial.py

describe('fv()', () => {
  it('calculates float when is end', () => {
    expect(fv(0.075, 20, -2000, 0, PaymentDueTime.End)).toBeCloseTo(86609.362673042924, 6)
  })

  it('calculates float when is begin', () => {
    expect(fv(0.075, 20, -2000, 0, PaymentDueTime.Begin)).toBeCloseTo(93105.064874, 6)
  })

  it('calculates float with rate 0', () => {
    expect(fv(0, 5, 100, 0)).toBeCloseTo(-500, 6)
    expect(fv(0.1, 5, 100, 0)).toBeCloseTo(-610.51, 6)
  })
})

describe('pmt()', () => {
  it('calculates float when is end', () => {
    expect(pmt(0.08 / 12, 5 * 12, 15000)).toBeCloseTo(-304.145914, 6)
  })

  it('calculates float when is begin', () => {
    expect(pmt(0.08 / 12, 5 * 12, 15000, 0, PaymentDueTime.Begin)).toBeCloseTo(-302.13170297305413, 6)
  })

  it('calculates float with rate 0', () => {
    expect(pmt(0.0, 5 * 12, 15000)).toBeCloseTo(-250, 6)
  })
})

describe('nper()', () => {
  it('calculates float when is end', () => {
    expect(nper(0, -2000, 0, 100000)).toBeCloseTo(50, 6)
    expect(nper(0.075, -2000, 0, 100000)).toBeCloseTo(21.544944, 6)
    expect(nper(0.1, 0, -500, 1500)).toBeCloseTo(11.52670461, 6)
    expect(nper(0.075, -2000, 0, 100000)).toBeCloseTo(21.5449442)
  })

  it('calculates float when is begin', () => {
    expect(nper(0.075, -2000, 0, 100000, PaymentDueTime.Begin)).toBeCloseTo(20.76156441)
  })

  it('deals with infinite payments', () => {
    expect(nper(0, -0.0, 1000)).toBe(Number.POSITIVE_INFINITY)
  })

  it('calculates float with rate 0', () => {
    expect(nper(0, -100, 1000)).toBeCloseTo(10, 6)
  })
})
