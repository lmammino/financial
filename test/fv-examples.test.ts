import { fv } from '../src/financial'

describe('fv() examples', () => {
  it('Documentation example', () => {
    expect(fv(0.05 / 12, 10 * 12, -100, -100)).toBeCloseTo(15692.928894335748, 10)
  })
})
