import { assert } from 'poku'

export function assertEqualApprox(a: number, b: number, digits = 6) {
  assert.equal(a.toFixed(digits), b.toFixed(digits))
}
