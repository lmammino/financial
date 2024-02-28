import { expect, test } from "bun:test"
import {
  fv,
  pmt,
  nper,
  ipmt,
  ppmt,
  pv,
  rate,
  irr,
  npv,
  mirr,
  PaymentDueTime,
} from '../src/index.js'

// Mostly based on
// https://github.com/numpy/numpy-financial/blob/master/numpy_financial/tests/test_financial.py

test('fv()', () => {
  test('calculates float when is end', () => {
    expect(fv(0.075, 20, -2000, 0, PaymentDueTime.End)).toBeCloseTo(
      86609.362673042924,
      6,
    )
  })

  test('calculates float when is begin', () => {
    expect(fv(0.075, 20, -2000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      93105.064874,
      6,
    )
  })

  test('calculates float with rate 0', () => {
    expect(fv(0, 5, 100, 0)).toBeCloseTo(-500, 6)
    expect(fv(0.1, 5, 100, 0)).toBeCloseTo(-610.51, 6)
  })
})

test('pmt()', () => {
  test('calculates float when is end', () => {
    expect(pmt(0.08 / 12, 5 * 12, 15000)).toBeCloseTo(-304.145914, 6)
  })

  test('calculates float when is begin', () => {
    expect(pmt(0.08 / 12, 5 * 12, 15000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -302.13170297305413,
      6,
    )
  })

  test('calculates float with rate 0', () => {
    expect(pmt(0.0, 5 * 12, 15000)).toBeCloseTo(-250, 6)
  })
})

test('nper()', () => {
  test('calculates float when is end', () => {
    expect(nper(0, -2000, 0, 100000)).toBeCloseTo(50, 6)
    expect(nper(0.075, -2000, 0, 100000)).toBeCloseTo(21.544944, 6)
    expect(nper(0.1, 0, -500, 1500)).toBeCloseTo(11.52670461, 6)
    expect(nper(0.075, -2000, 0, 100000)).toBeCloseTo(21.5449442)
  })

  test('calculates float when is begin', () => {
    expect(nper(0.075, -2000, 0, 100000, PaymentDueTime.Begin)).toBeCloseTo(
      20.76156441,
    )
  })

  test('deals with infinite payments', () => {
    expect(nper(0, -0.0, 1000)).toBe(Number.POSITIVE_INFINITY)
  })

  test('calculates float with rate 0', () => {
    expect(nper(0, -100, 1000)).toBeCloseTo(10, 6)
  })
})

test('ipmt()', () => {
  test('calculates float when is end', () => {
    expect(ipmt(0.1 / 12, 1, 24, 2000)).toBeCloseTo(-16.666667, 6)
    expect(ipmt(0.1 / 12, 2, 24, 2000)).toBeCloseTo(-16.03647345, 6)
    expect(ipmt(0.1 / 12, 3, 24, 2000)).toBeCloseTo(-15.40102862, 6)
    expect(ipmt(0.1 / 12, 4, 24, 2000)).toBeCloseTo(-14.76028842, 6)
  })

  test('calculates float when is begin', () => {
    expect(ipmt(0.1 / 12, 1, 24, 2000, 0, PaymentDueTime.Begin)).toBe(0)
    expect(
      ipmt(0.001988079518355057, 0, 360, 300000, 0, PaymentDueTime.Begin),
    ).toBe(Number.NaN)
    expect(
      ipmt(0.001988079518355057, 1, 360, 300000, 0, PaymentDueTime.Begin),
    ).toBe(0)
    expect(
      ipmt(0.001988079518355057, 2, 360, 300000, 0, PaymentDueTime.Begin),
    ).toBeCloseTo(-594.107158, 6)
    expect(
      ipmt(0.001988079518355057, 3, 360, 300000, 0, PaymentDueTime.Begin),
    ).toBeCloseTo(-592.971592, 6)
  })
})

test('ppmt()', () => {
  test('calculates float when is end', () => {
    expect(ppmt(0.1 / 12, 1, 60, 55000)).toBeCloseTo(-710.25412578642, 6)
    expect(ppmt(0.08 / 12, 1, 60, 15000)).toBeCloseTo(-204.145914, 6)
  })

  test('calculates float when is begin', () => {
    expect(ppmt(0.1 / 12, 1, 60, 55000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -1158.929712,
      6,
    )
    expect(ppmt(0.08 / 12, 1, 60, 15000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -302.131703,
      6,
    )
  })
})

test('pv()', () => {
  test('calculates float when is end', () => {
    expect(pv(0.07, 20, 12000)).toBeCloseTo(-127128.1709461939, 6)
    expect(pv(0.07, 21, 12000)).toBeCloseTo(-130026.327987097, 6)
    expect(pv(0.07, 22, 12000)).toBeCloseTo(-132734.88596925, 6)
    expect(pv(0.07, 23, 12000)).toBeCloseTo(-135266.248569392, 6)
    expect(pv(0.07, 24, 12000)).toBeCloseTo(-137632.008008778, 6)
    expect(pv(0.07, 25, 12000)).toBeCloseTo(-139842.998139045, 6)
  })

  test('calculates float when is begin', () => {
    expect(pv(0.07, 20, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -136027.1429124,
      6,
    )
    expect(pv(0.07, 21, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -139128.1709461,
      6,
    )
    expect(pv(0.07, 22, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -142026.327987,
      6,
    )
    expect(pv(0.07, 23, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -144734.8859692,
      6,
    )
    expect(pv(0.07, 24, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -147266.2485693,
      6,
    )
    expect(pv(0.07, 25, 12000, 0, PaymentDueTime.Begin)).toBeCloseTo(
      -149632.0080087,
      6,
    )
  })

  test('calculates float when the rate is 0', () => {
    expect(pv(0, 20, 12000, 0)).toBeCloseTo(-240000, 6)
  })

  test('calculates float when fv != 0', () => {
    expect(pv(0, 20, 12000, 1000)).toBeCloseTo(-241000, 6)
  })
})

test('rate()', () => {
  test('calculates float when is end', () => {
    expect(rate(10, 0, -3500, 10000)).toBeCloseTo(0.1106908, 6)
  })

  test('calculates float when is begin', () => {
    expect(rate(10, 0, -3500, 10000, PaymentDueTime.Begin)).toBeCloseTo(
      0.1106908,
      6,
    )
  })

  test('Should return NaN for infeasible solution', () => {
    expect(rate(12, 400, 10000, 5000, PaymentDueTime.End)).toBeNaN()
    expect(rate(12, 400, 10000, 5000, PaymentDueTime.Begin)).toBeNaN()
  })

  test('calculates float with a custom guess, tolerance and maxIter', () => {
    expect(
      rate(10, 0, -3500, 10000, PaymentDueTime.Begin, 0.2, 1e-5, 200),
    ).toBeCloseTo(0.1106908, 6)
  })
})

test('irr()', () => {
  test('calculates basic values', () => {
    expect(irr([-150000, 15000, 25000, 35000, 45000, 60000])).toBeCloseTo(
      0.052433,
      6,
    )
    expect(irr([-100, 0, 0, 74])).toBeCloseTo(-0.095496, 6)
    expect(irr([-100, 39, 59, 55, 20])).toBeCloseTo(0.2809484, 6)
    expect(irr([-100, 100, 0, -7])).toBeCloseTo(-0.0833, 6)
    expect(irr([-100, 100, 0, 7])).toBeCloseTo(0.0620585, 6)
    expect(irr([-5, 10.5, 1, -8, 1])).toBeCloseTo(0.088598, 6)
  })

  test('calculates trailing zeroes correctly', () => {
    expect(irr([-5, 10.5, 1, -8, 1, 0, 0, 0])).toBeCloseTo(0.088598, 6)
  })

  test('returns NaN if there is no solution', () => {
    expect(irr([-1, -2, -3])).toBeNaN()
  })

  test('calculates with custom guess, tol and maxIter', () => {
    expect(irr([-5, 10.5, 1, -8, 1], 0.1, 1e-10, 10)).toBeCloseTo(
      0.08859833852439172,
      9,
    )
  })

  test("returns null if can't calculate the result within the given number of iterations", () => {
    expect(irr([-5, 10.5, 1, -8, 1], 0.1, 1e-10, 2)).toBeNaN()
  })
})

test('npv()', () => {
  test('calculates float', () => {
    expect(npv(0.05, [-15000, 1500, 2500, 3500, 4500, 6000])).toBeCloseTo(
      122.894855,
      6,
    )
  })
})

test('mirr()', () => {
  test('calculates float', () => {
    expect(
      mirr([-4500, -800, 800, 800, 600, 600, 800, 800, 700, 3000], 0.08, 0.055),
    ).toBeCloseTo(0.066597, 6)
    expect(
      mirr([-120000, 39000, 30000, 21000, 37000, 46000], 0.1, 0.12),
    ).toBeCloseTo(0.126094, 6)
    expect(mirr([100, 200, -50, 300, -200], 0.05, 0.06)).toBeCloseTo(
      0.342823,
      6,
    )
  })

  test('returns NaN if mirr() cannot be calculated', () => {
    expect(mirr([39000, 30000, 21000, 37000, 46000], 0.1, 0.12)).toBeNaN()
    expect(mirr([-39000, -30000, -21000, -37000, -46000], 0.1, 0.12)).toBeNaN()
  })
})
