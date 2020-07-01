import { fv, pmt, nper, ipmt, ppmt, pv, rate, PaymentDueTime } from '../src/financial'

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

describe('ipmt()', () => {
  it('calculates float when is end', () => {
    expect(ipmt(0.1 / 12, 1, 24, 2000)).toBeCloseTo(-16.666667, 6)
    expect(ipmt(0.1 / 12, 2, 24, 2000)).toBeCloseTo(-16.03647345, 6)
    expect(ipmt(0.1 / 12, 3, 24, 2000)).toBeCloseTo(-15.40102862, 6)
    expect(ipmt(0.1 / 12, 4, 24, 2000)).toBeCloseTo(-14.76028842, 6)
  })

  it('calculates float when is begin', () => {
    expect(ipmt(0.1 / 12, 1, 24, 2000, 0, PaymentDueTime.Begin)).toBe(0)
    expect(ipmt(0.001988079518355057, 0, 360, 300000, 0, PaymentDueTime.Begin)).toBe(Number.NaN)
    expect(ipmt(0.001988079518355057, 1, 360, 300000, 0, PaymentDueTime.Begin)).toBe(0)
    expect(ipmt(0.001988079518355057, 2, 360, 300000, 0, PaymentDueTime.Begin)).toBeCloseTo(-594.107158, 6)
    expect(ipmt(0.001988079518355057, 3, 360, 300000, 0, PaymentDueTime.Begin)).toBeCloseTo(-592.971592, 6)
  })
})

describe('ppmt()', () => {
  it('calculates float when is end', () => {
    expect(ppmt(0.1 / 12, 1, 60, 55000)).toBeCloseTo(-710.25412578642, 6)
    expect(ppmt(0.08 / 12, 1, 60, 15000)).toBeCloseTo(-204.145914, 6)
  })

  it('calculates float when is begin', () => {
    expect(ppmt(0.1 / 12, 1, 60, 55000, 0, PaymentDueTime.Begin)).toBeCloseTo(-1158.929712, 6)
    expect(ppmt(0.08 / 12, 1, 60, 15000, 0, PaymentDueTime.Begin)).toBeCloseTo(-302.131703, 6)
  })
})

describe('pv()', () => {
  it('calculates float when is end', () => {
    expect(pv(0.07, 20, 12000, 0)).toBeCloseTo(-127128.1709461939, 6)
    expect(pv(0.07, 21, 12000, 0)).toBeCloseTo(-130026.3279870970, 6)
    expect(pv(0.07, 22, 12000, 0)).toBeCloseTo(-132734.8859692500, 6)
    expect(pv(0.07, 23, 12000, 0)).toBeCloseTo(-135266.2485693920, 6)
    expect(pv(0.07, 24, 12000, 0)).toBeCloseTo(-137632.0080087780, 6)
    expect(pv(0.07, 25, 12000, 0)).toBeCloseTo(-139842.9981390450, 6)
  })

  it('calculates float when is begin', () => {
    expect(pv(0.07, 20, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(-136027.1429124, 6)
    expect(pv(0.07, 21, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(-139128.1709461, 6)
    expect(pv(0.07, 22, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(-142026.3279870, 6)
    expect(pv(0.07, 23, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(-144734.8859692, 6)
    expect(pv(0.07, 24, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(-147266.2485693, 6)
    expect(pv(0.07, 25, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(-149632.0080087, 6)
  })
})

describe('rate()', () => {
  it('calculates float when is end', () => {
    expect(rate(10, 0, -3500, 10000)).toBeCloseTo(0.1106908, 6)
  })

  it('calculates float when is begin', () => {
    expect(rate(10, 0, -3500, 10000, PaymentDueTime.Begin)).toBeCloseTo(0.1106908, 6)
  })

  it('Should return NaN for infeasible solution', () => {
    expect(rate(12, 400, 10000, 5000, PaymentDueTime.End)).toBeNaN()
    expect(rate(12, 400, 10000, 5000, PaymentDueTime.Begin)).toBeNaN()
  })
})
