/**
 * When payments are due
 */
export enum PaymentDueTime {
  /** Payments due at the beginning of a period (1) */
  Begin = 'begin', // 1
  /** Payments are due at the end of a period (0) */
  End = 'end' // 0
}

/**
 * Compute the future value.
 *
 * @param rate - Rate of interest as decimal (not per cent) per period
 * @param nper - Number of compounding periods
 * @param pmt - A fixed payment, paid either at the beginning or ar the end (specified by `when`)
 * @param pv - Present value
 * @param when - When payment was made
 *
 * @returns The value at the end of the `nper` periods
 *
 * ## Examples
 *
 * What is the future value after 10 years of saving $100 now, with
 * an additional monthly savings of $100. Assume the interest rate is
 * 5% (annually) compounded monthly?
 *
 * ```javascript
 * import { fv } from 'financial'
 *
 * fv(0.05 / 12, 10 * 12, -100, -100) // 15692.928894335748
 * ```
 *
 * By convention, the negative sign represents cash flow out (i.e. money not
 * available today).  Thus, saving $100 a month at 5% annual interest leads
 * to $15,692.93 available to spend in 10 years.
 *
 * ## Notes
 *
 * The future value is computed by solving the equation:
 *
 * ```
 * fv + pv * (1+rate) ** nper + pmt * (1 + rate * when) / rate * ((1 + rate) ** nper - 1) == 0
 * ```
 *
 * or, when `rate == 0`:
 *
 * ```
 * fv + pv + pmt * nper == 0
 * ```
 *
 * ## References
 *
 * [Wheeler, D. A., E. Rathke, and R. Weir (Eds.) (2009, May)](http://www.oasis-open.org/committees/documents.php?wg_abbrev=office-formulaOpenDocument-formula-20090508.odt).
 */
export function fv (rate: number, nper: number, pmt: number, pv: number, when : PaymentDueTime = PaymentDueTime.End) : number {
  const isRateZero = rate === 0

  if (isRateZero) {
    return -(pv + pmt * nper)
  }

  const temp = (1 + rate) ** nper
  const whenMult = when === PaymentDueTime.Begin ? 1 : 0
  return (-pv * temp - pmt * (1 + rate * whenMult) / rate * (temp - 1))
}

/**
 * Compute the payment against loan principal plus interest.
 *
 * @param rate - Rate of interest (per period)
 * @param nper - Number of compounding periods (e.g., number of payments)
 * @param pv - Present value (e.g., an amount borrowed)
 * @param fv - Future value (e.g., 0)
 * @param when - When payments are due
 *
 * @returns the (fixed) periodic payment
 *
 * ## Examples
 *
 * What is the monthly payment needed to pay off a $200,000 loan in 15
 * years at an annual interest rate of 7.5%?
 *
 * ```javascript
 * import { pmt } from 'financial'
 *
 * pmt(0.075/12, 12*15, 200000) // -1854.0247200054619
 * ```
 *
 * In order to pay-off (i.e., have a future-value of 0) the $200,000 obtained
 * today, a monthly payment of $1,854.02 would be required.  Note that this
 * example illustrates usage of `fv` having a default value of 0.
 *
 * ## Notes
 *
 * The payment is computed by solving the equation:
 *
 * ```
 * fv + pv * (1 + rate) ** nper + pmt * (1 + rate*when) / rate * ((1 + rate) ** nper - 1) == 0
 * ```
 *
 * or, when `rate == 0`:
 *
 * ```
 * fv + pv + pmt * nper == 0
 * ```
 *
 * for `pmt`.
 *
 * Note that computing a monthly mortgage payment is only
 * one use for this function.  For example, `pmt` returns the
 * periodic deposit one must make to achieve a specified
 * future balance given an initial deposit, a fixed,
 * periodically compounded interest rate, and the total
 * number of periods.
 *
 * ## References
 *
 * [Wheeler, D. A., E. Rathke, and R. Weir (Eds.) (2009, May)](http://www.oasis-open.org/committees/documents.php?wg_abbrev=office-formulaOpenDocument-formula-20090508.odt).
 */
export function pmt (rate: number, nper: number, pv: number, fv = 0, when = PaymentDueTime.End): number {
  const isRateZero = rate === 0
  const temp = (1 + rate) ** nper
  const whenMult = when === PaymentDueTime.Begin ? 1 : 0
  const maskedRate = isRateZero ? 1 : rate
  const fact = isRateZero
    ? nper
    : (1 + maskedRate * whenMult) * (temp - 1) / maskedRate

  return -(fv + pv * temp) / fact
}

/**
 * Compute the number of periodic payments.
 *
 * @param rate - Rate of interest (per period)
 * @param pmt - Payment
 * @param pv - Present value
 * @param fv - Future value
 * @param when - When payments are due
 *
 * @returns The number of periodic payments
 *
 * ## Examples
 *
 * If you only had $150/month to pay towards the loan, how long would it take
 * to pay-off a loan of $8,000 at 7% annual interest?
 *
 * ```javascript
 * import { nper } from 'financial'
 *
 * Math.round(nper(0.07/12, -150, 8000), 5) // 64.07335
 * ```
 *
 * So, over 64 months would be required to pay off the loan.
 *
 * ## Notes
 *
 * The number of periods `nper` is computed by solving the equation:
 *
 * ```
 * fv + pv * (1+rate) ** nper + pmt * (1+rate * when) / rate * ((1+rate) ** nper-1) = 0
 * ```
 *
 * but if `rate = 0` then:
 *
 * ```
 * fv + pv + pmt * nper = 0
 * ```
 */
export function nper (rate: number, pmt: number, pv: number, fv = 0, when = PaymentDueTime.End) : number {
  const isRateZero = rate === 0
  if (isRateZero) {
    return -(fv + pv) / pmt
  }

  const whenMult = when === PaymentDueTime.Begin ? 1 : 0
  const z = pmt * (1 + rate * whenMult) / rate
  return Math.log((-fv + z) / (pv + z)) / Math.log(1 + rate)
}

/**
 * Compute the interest portion of a payment.
 *
 * @param rate - Rate of interest as decimal (not per cent) per period
 * @param per - Interest paid against the loan changes during the life or the loan. The `per` is the payment period to calculate the interest amount
 * @param nper - Number of compounding periods
 * @param pv - Present value
 * @param fv - Future value
 * @param when - When payments are due
 *
 * @returns Interest portion of payment
 *
 * ## Examples
 *
 * What is the amortization schedule for a 1 year loan of $2500 at
 * 8.24% interest per year compounded monthly?
 *
 * ```javascript
 * const principal = 2500
 * const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 * const ipmts = periods.map((per) => f.ipmt(0.0824 / 12, per, 1 * 12, principal))
 * expect(ipmts).toEqual([
 *   -17.166666666666668,
 *   -15.789337457350777,
 *   -14.402550587464257,
 *   -13.006241114404524,
 *   -11.600343649629737,
 *   -10.18479235559687,
 *   -8.759520942678298,
 *   -7.324462666057678,
 *   -5.879550322604295,
 *   -4.424716247725826,
 *   -2.9598923121998877,
 *   -1.4850099189833388
 * ])
 * const interestpd = ipmts.reduce((a, b) => a + b, 0)
 * expect(interestpd).toBeCloseTo(-112.98308424136215, 6)
 * ```
 *
 * The `periods` variable represents the periods of the loan.  Remember that financial equations start the period count at 1!
 *
 * ## Notes
 *
 * The total payment is made up of payment against principal plus interest.
 *
 * ```
 * pmt = ppmt + ipmt
 * ```
 */
export function ipmt (rate: number, per: number, nper: number, pv: number, fv = 0, when = PaymentDueTime.End) : number {
  // Payments start at the first period, so payments before that
  // don't make any sense.
  if (per < 1) {
    return Number.NaN
  }

  // If payments occur at the beginning of a period and this is the
  // first period, then no interest has accrued.
  if (when === PaymentDueTime.Begin && per === 1) {
    return 0
  }

  const totalPmt = pmt(rate, nper, pv, fv, when)
  let ipmtVal = _rbl(rate, per, totalPmt, pv, when) * rate

  // If paying at the beginning we need to discount by one period
  if (when === PaymentDueTime.Begin && per > 1) {
    ipmtVal = ipmtVal / (1 + rate)
  }

  return ipmtVal
}

/**
 * Compute the payment against loan principal.
 *
 * @param rate - Rate of interest (per period)
 * @param per - Amount paid against the loan changes.  The `per` is the period of interest.
 * @param nper - Number of compounding periods
 * @param pv - Present value
 * @param fv - Future value
 * @param when - When payments are due
 *
 * @returns the payment against loan principal
 */
export function ppmt (rate: number, per: number, nper: number, pv: number, fv = 0, when = PaymentDueTime.End) : number {
  const total = pmt(rate, nper, pv, fv, when)
  return total - ipmt(rate, per, nper, pv, fv, when)
}

/**
 * Calculates the present value of an annuity investment based on constant-amount
 * periodic payments and a constant interest rate.
 *
 * @param rate - Rate of interest (per period)
 * @param nper - Number of compounding periods
 * @param pmt - Payment
 * @param fv - Future value
 * @param when - When payments are due
 *
 * @returns the present value of a payment or investment
 *
 * ## Examples
 *
 * What is the present value (e.g., the initial investment)
 * of an investment that needs to total $15692.93
 * after 10 years of saving $100 every month?  Assume the
 * interest rate is 5% (annually) compounded monthly.
 *
 * ```javascript
 * import { pv } from 'financial'
 *
 * pv(0.05/12, 10*12, -100, 15692.93) // -100.00067131625819
 * ```
 *
 * By convention, the negative sign represents cash flow out
 * (i.e., money not available today).  Thus, to end up with
 * $15,692.93 in 10 years saving $100 a month at 5% annual
 * interest, one's initial deposit should also be $100.
 *
 * ## Notes
 *
 * The present value is computed by solving the equation:
 *
 * ```
 * fv + pv * (1 + rate) ** nper + pmt * (1 + rate * when) / rate * ((1 + rate) ** nper - 1) = 0
 * ```
 *
 * or, when `rate = 0`:
 *
 * ```
 * fv + pv + pmt * nper = 0
 * ```
 *
 * for `pv`, which is then returned.
 *
 * ## References
 *
 * [Wheeler, D. A., E. Rathke, and R. Weir (Eds.) (2009, May)](http://www.oasis-open.org/committees/documents.php?wg_abbrev=office-formulaOpenDocument-formula-20090508.odt).
 */
export function pv (rate: number, nper: number, pmt: number, fv = 0, when = PaymentDueTime.End): number {
  const whenMult = when === PaymentDueTime.Begin ? 1 : 0
  const isRateZero = rate === 0
  const temp = (1 + rate) ** nper
  const fact = isRateZero
    ? nper
    : (1 + rate * whenMult) * (temp - 1) / rate
  return -(fv + pmt * fact) / temp
}

/**
 * Compute the rate of interest per period
 *
 * @param nper - Number of compounding periods
 * @param pmt - Payment
 * @param pv - Present value
 * @param fv - Future value
 * @param when - When payments are due ('begin' or 'end')
 * @param guess - Starting guess for solving the rate of interest
 * @param tol - Required tolerance for the solution
 * @param maxIter - Maximum iterations in finding the solution
 *
 * @returns the rate of interest per period (or `NaN` if it could
 *  not be computed within the number of iterations provided)
 *
 * ## Notes
 *
 * Use Newton's iteration until the change is less than 1e-6
 * for all values or a maximum of 100 iterations is reached.
 * Newton's rule is:
 *
 * ```
 * r_{n+1} = r_{n} - g(r_n)/g'(r_n)
 * ```
 *
 * where:
 *
 * - `g(r)` is the formula
 * - `g'(r)` is the derivative with respect to r.
 *
 *
 * The rate of interest is computed by iteratively solving the
 * (non-linear) equation:
 *
 * ```
 * fv + pv * (1+rate) ** nper + pmt * (1+rate * when) / rate * ((1+rate) ** nper - 1) = 0
 * ```
 *
 * for `rate.
 *
 * ## References
 *
 * [Wheeler, D. A., E. Rathke, and R. Weir (Eds.) (2009, May)](http://www.oasis-open.org/committees/documents.php?wg_abbrev=office-formulaOpenDocument-formula-20090508.odt).
 */
export function rate (nper: number, pmt: number, pv: number, fv: number, when = PaymentDueTime.End, guess = 0.1, tol = 1e-6, maxIter = 100) : number {
  let rn = guess
  let iterator = 0
  let close = false

  while (iterator < maxIter && !close) {
    const rnp1 = rn - _gDivGp(rn, nper, pmt, pv, fv, when)
    const diff = Math.abs(rnp1 - rn)
    close = diff < tol
    iterator++
    rn = rnp1
  }

  // if exausted all the iterations and the result is not
  // close enough, returns `NaN`
  if (!close) {
    return Number.NaN
  }

  return rn
}

/**
 * This function is here to simply have a different name for the 'fv'
 * function to not interfere with the 'fv' keyword argument within the 'ipmt'
 * function.  It is the 'remaining balance on loan' which might be useful as
 * it's own function, but is easily calculated with the 'fv' function.
 *
 * @private
 */
function _rbl (rate: number, per: number, pmt: number, pv: number, when: PaymentDueTime) {
  return fv(rate, (per - 1), pmt, pv, when)
}

/**
 * Evaluates `g(r_n)/g'(r_n)`, where:
 *
 * ```
 * g = fv + pv * (1+rate) ** nper + pmt * (1+rate * when)/rate * ((1+rate) ** nper - 1)
 * ```
 *
 * @private
 */
function _gDivGp (r: number, n: number, p: number, x: number, y: number, when: PaymentDueTime): number {
  const w = when === PaymentDueTime.Begin ? 1 : 0

  const t1 = (r + 1) ** n
  const t2 = (r + 1) ** (n - 1)
  const g = y + t1 * x + p * (t1 - 1) * (r * w + 1) / r
  const gp = (n * t2 * x -
    p * (t1 - 1) * (r * w + 1) / (r ** 2) +
    n * p * t2 * (r * w + 1) / r +
    p * (t1 - 1) * w / r)
  return g / gp
}
