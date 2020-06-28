import { fv, PaymentDueTime } from '../src/financial'

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
