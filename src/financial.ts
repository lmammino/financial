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
 * ```js
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
 * Wheeler, D. A., E. Rathke, and R. Weir (Eds.) (2009, May).
 * Open Document Format for Office Applications (OpenDocument)v1.2,
 * Part 2: Recalculated Formula (OpenFormula) Format - Annotated Version,
 * Pre-Draft 12. Organization for the Advancement of Structured Information
 * Standards (OASIS). Billerica, MA, USA. [ODT Document].
 * [Link](http://www.oasis-open.org/committees/documents.php?wg_abbrev=office-formulaOpenDocument-formula-20090508.odt).
 */
export function fv (rate: number, nper: number, pmt: number, pv: number, when : PaymentDueTime = PaymentDueTime.End) : number {
  // when = _convert_when(when)
  // rate, nper, pmt, pv, when = np.broadcast_arrays(rate, nper, pmt, pv, when)
  // fv_array = np.empty_like(rate)
  // zero = rate == 0
  // nonzero = ~zero
  // fv_array[zero] = -(pv[zero] + pmt[zero] * nper[zero])
  // rate_nonzero = rate[nonzero]
  // temp = (1 + rate_nonzero)**nper[nonzero]
  // fv_array[nonzero] = (
  //     - pv[nonzero] * temp
  //     - pmt[nonzero] * (1 + rate_nonzero * when[nonzero]) / rate_nonzero
  //     * (temp - 1)
  // )
  // if np.ndim(fv_array) == 0:
  //     # Follow the ufunc convention of returning scalars for scalar
  //     # and 0d array inputs.
  //     return fv_array.item(0)
  // return fv_array
  const isRateZero = rate === 0

  if (isRateZero) {
    return -(pv + pmt * nper)
  }

  const temp = (1 + rate) ** nper
  const whenMult = when === PaymentDueTime.Begin ? 1 : 0
  return (-pv * temp - pmt * (1 + rate * whenMult) / rate * (temp - 1))
}
