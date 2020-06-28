export enum PaymentDueTime {
  Begin = 'begin',
  End = 'end'
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
  // when = _convert_when(when)
  // (rate, nper, pv, fv, when) = map(np.array, [rate, nper, pv, fv, when])
  // temp = (1 + rate)**nper
  // mask = (rate == 0)
  // masked_rate = np.where(mask, 1, rate)
  // fact = np.where(mask != 0, nper,
  //                 (1 + masked_rate*when)*(temp - 1)/masked_rate)
  // return -(fv + pv*temp) / fact

  const isRateZero = rate === 0
  const temp = (1 + rate) ** nper
  const whenMult = when === PaymentDueTime.Begin ? 1 : 0
  const maskedRate = isRateZero ? 1 : rate
  const fact = isRateZero
    ? nper
    : (1 + maskedRate * whenMult) * (temp - 1) / maskedRate

  return -(fv + pv * temp) / fact
}
