import { assert, describe, it } from 'poku'
import {
  PaymentDueTime,
  fv,
  ipmt,
  irr,
  mirr,
  nper,
  npv,
  pmt,
  ppmt,
  pv,
  rate,
} from '../src/index.ts'
import { assertEqualApprox } from './utils.ts'

// Mostly based on
// https://github.com/numpy/numpy-financial/blob/master/numpy_financial/tests/test_financial.py

describe('fv()', async () => {
  await it('calculates float when is end', () => {
    assertEqualApprox(
      fv(0.075, 20, -2000, 0, PaymentDueTime.End),
      86609.362673042924,
    )
  })

  await it('calculates float when is begin', () => {
    assertEqualApprox(
      fv(0.075, 20, -2000, 0, PaymentDueTime.Begin),
      93105.064874,
    )
  })

  await it('calculates float with rate 0', () => {
    assertEqualApprox(fv(0, 5, 100, 0), -500)
    assertEqualApprox(fv(0.1, 5, 100, 0), -610.51)
  })
})

describe('pmt()', async () => {
  await it('calculates float when is end', () => {
    assertEqualApprox(pmt(0.08 / 12, 5 * 12, 15000), -304.145914)
  })

  await it('calculates float when is begin', () => {
    assertEqualApprox(
      pmt(0.08 / 12, 5 * 12, 15000, 0, PaymentDueTime.Begin),
      -302.13170297305413,
    )
  })

  await it('calculates float with rate 0', () => {
    assertEqualApprox(pmt(0.0, 5 * 12, 15000), -250)
  })
})

describe('nper()', async () => {
  await it('calculates float when is end', () => {
    assertEqualApprox(nper(0, -2000, 0, 100000), 50)
    assertEqualApprox(nper(0.075, -2000, 0, 100000), 21.544944)
    assertEqualApprox(nper(0.1, 0, -500, 1500), 11.52670461)
    assertEqualApprox(nper(0.075, -2000, 0, 100000), 21.5449442)
  })

  await it('calculates float when is begin', () => {
    assertEqualApprox(
      nper(0.075, -2000, 0, 100000, PaymentDueTime.Begin),
      20.76156441,
    )
  })

  await it('deals with infinite payments', () => {
    assert.equal(nper(0, -0.0, 1000), Number.POSITIVE_INFINITY)
  })

  await it('calculates float with rate 0', () => {
    assertEqualApprox(nper(0, -100, 1000), 10)
  })
})

describe('ipmt()', async () => {
  await it('calculates float when is end', () => {
    assertEqualApprox(ipmt(0.1 / 12, 1, 24, 2000), -16.666667)
    assertEqualApprox(ipmt(0.1 / 12, 2, 24, 2000), -16.03647345)
    assertEqualApprox(ipmt(0.1 / 12, 3, 24, 2000), -15.40102862)
    assertEqualApprox(ipmt(0.1 / 12, 4, 24, 2000), -14.76028842)
  })

  await it('calculates float when is begin', () => {
    assert.equal(ipmt(0.1 / 12, 1, 24, 2000, 0, PaymentDueTime.Begin), 0)
    assert.equal(
      ipmt(0.001988079518355057, 0, 360, 300000, 0, PaymentDueTime.Begin),
      Number.NaN,
    )
    assert.equal(
      ipmt(0.001988079518355057, 1, 360, 300000, 0, PaymentDueTime.Begin),
      0,
    )
    assertEqualApprox(
      ipmt(0.001988079518355057, 2, 360, 300000, 0, PaymentDueTime.Begin),
      -594.107158,
    )
    assertEqualApprox(
      ipmt(0.001988079518355057, 3, 360, 300000, 0, PaymentDueTime.Begin),
      -592.971592,
    )
  })
})

describe('ppmt()', async () => {
  await it('calculates float when is end', () => {
    assertEqualApprox(ppmt(0.1 / 12, 1, 60, 55000), -710.25412578642)
    assertEqualApprox(ppmt(0.08 / 12, 1, 60, 15000), -204.145914)
  })

  await it('calculates float when is begin', () => {
    assertEqualApprox(
      ppmt(0.1 / 12, 1, 60, 55000, 0, PaymentDueTime.Begin),
      -1158.929712,
    )
    assertEqualApprox(
      ppmt(0.08 / 12, 1, 60, 15000, 0, PaymentDueTime.Begin),
      -302.131703,
    )
  })
})

describe('pv()', async () => {
  await it('calculates float when is end', () => {
    assertEqualApprox(pv(0.07, 20, 12000), -127128.1709461939)
    assertEqualApprox(pv(0.07, 21, 12000), -130026.327987097)
    assertEqualApprox(pv(0.07, 22, 12000), -132734.88596925)
    assertEqualApprox(pv(0.07, 23, 12000), -135266.248569392)
    assertEqualApprox(pv(0.07, 24, 12000), -137632.008008778)
    assertEqualApprox(pv(0.07, 25, 12000), -139842.998139045)
  })

  await it('calculates float when is begin', () => {
    assertEqualApprox(
      pv(0.07, 20, 12000, 0, PaymentDueTime.Begin),
      -136027.1429124,
    )
    assertEqualApprox(
      pv(0.07, 21, 12000, 0, PaymentDueTime.Begin),
      -139128.1709461,
    )
    assertEqualApprox(
      pv(0.07, 22, 12000, 0, PaymentDueTime.Begin),
      -142026.327987,
    )
    assertEqualApprox(
      pv(0.07, 23, 12000, 0, PaymentDueTime.Begin),
      -144734.8859692,
    )
    assertEqualApprox(
      pv(0.07, 24, 12000, 0, PaymentDueTime.Begin),
      -147266.2485693,
    )
    assertEqualApprox(
      pv(0.07, 25, 12000, 0, PaymentDueTime.Begin),
      -149632.0080087,
    )
  })

  await it('calculates float when the rate is 0', () => {
    assertEqualApprox(pv(0, 20, 12000, 0), -240000)
  })

  await it('calculates float when fv != 0', () => {
    assertEqualApprox(pv(0, 20, 12000, 1000), -241000)
  })
})

describe('rate()', async () => {
  await it('calculates float when is end', () => {
    assertEqualApprox(rate(10, 0, -3500, 10000), 0.1106908)
  })

  await it('calculates float when is begin', () => {
    assertEqualApprox(
      rate(10, 0, -3500, 10000, PaymentDueTime.Begin),
      0.1106908,
    )
  })

  await it('Should return NaN for infeasible solution', () => {
    assert.equal(rate(12, 400, 10000, 5000, PaymentDueTime.End), Number.NaN)
    assert.equal(rate(12, 400, 10000, 5000, PaymentDueTime.Begin), Number.NaN)
  })

  await it('calculates float with a custom guess, tolerance and maxIter', () => {
    assertEqualApprox(
      rate(10, 0, -3500, 10000, PaymentDueTime.Begin, 0.2, 1e-5, 200),
      0.1106908,
    )
  })
})

describe('irr()', async () => {
  await it('calculates basic values', () => {
    assertEqualApprox(
      irr([-150000, 15000, 25000, 35000, 45000, 60000]),
      0.052432889,
      9,
    )
    assertEqualApprox(irr([-100, 0, 0, 74]), -0.095496)
    assertEqualApprox(irr([-100, 39, 59, 55, 20]), 0.2809484)
    assertEqualApprox(irr([-100, 100, 0, -7]), -0.0833)
    assertEqualApprox(irr([-100, 100, 0, 7]), 0.062058)
    assertEqualApprox(irr([-5, 10.5, 1, -8, 1]), 0.088598)
  })

  await it('calculates trailing zeroes correctly', () => {
    assertEqualApprox(irr([-5, 10.5, 1, -8, 1, 0, 0, 0]), 0.088598)
  })

  await it('returns NaN if there is no solution', () => {
    assert.equal(irr([-1, -2, -3]), Number.NaN)
  })

  await it('calculates with custom guess, tol and maxIter', () => {
    assertEqualApprox(
      irr([-5, 10.5, 1, -8, 1], 0.1, 1e-10, 10),
      0.08859833852439172,
      9,
    )
  })

  await it("returns null if can't calculate the result within the given number of iterations", () => {
    assert.equal(irr([-5, 10.5, 1, -8, 1], 0.1, 1e-10, 2), Number.NaN)
  })
})

describe('npv()', async () => {
  await it('calculates float', () => {
    assertEqualApprox(
      npv(0.05, [-15000, 1500, 2500, 3500, 4500, 6000]),
      122.894855,
    )
  })
})

describe('mirr()', async () => {
  await it('calculates float', () => {
    assertEqualApprox(
      mirr([-4500, -800, 800, 800, 600, 600, 800, 800, 700, 3000], 0.08, 0.055),
      0.066597,
    )
    assertEqualApprox(
      mirr([-120000, 39000, 30000, 21000, 37000, 46000], 0.1, 0.12),
      0.126094,
    )
    assertEqualApprox(mirr([100, 200, -50, 300, -200], 0.05, 0.06), 0.342823)
  })

  await it('returns NaN if mirr() cannot be calculated', () => {
    assert.equal(
      mirr([39000, 30000, 21000, 37000, 46000], 0.1, 0.12),
      Number.NaN,
    )
    assert.equal(
      mirr([-39000, -30000, -21000, -37000, -46000], 0.1, 0.12),
      Number.NaN,
    )
  })
})
