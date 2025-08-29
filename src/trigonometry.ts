export type Degree = number

/**
 * Convert degrees to radians
 * @param d - degrees
 * @returns radians
 */
export const dtr = (d: Degree) => Number(((d * Math.PI) / 180.0).toFixed(5))

/**
 * Convert radians to degrees
 * @param r - radians
 * @returns degrees
 */
export const rtd = (r: number) => Number(((r * 180.0) / Math.PI).toFixed(5))

// Direct trigonometric functions (input in degrees, output in ratio)
export const sin = (d: Degree) => Math.sin(dtr(d))
export const cos = (d: Degree) => Math.cos(dtr(d))
export const tan = (d: Degree) => Math.tan(dtr(d))

// Inverse trigonometric functions (input in ratio, output in degrees)
export const arcsin = (x: number) => rtd(Math.asin(x))
export const arccos = (x: number) => rtd(Math.acos(x))
export const arctan = (x: number) => rtd(Math.atan(x))
export const arccot = (x: number) => rtd(Math.atan(1 / x))

/**
 * Compute the arctangent of y/x in degrees
 * @param y
 * @param x
 * @returns angle in degrees
 */
export const arctan2 = (y: number, x: number) => rtd(Math.atan2(y, x))

/**
 * Normalize an angle θ to any desired range [a,b), where a is the lower bound and b is the upper bound.
 *
 * @param a Lower bound in degrees
 * @param b Upper bound in degrees
 * @returns A function that given an angle normalizes it in the range [a, b)
 */
export const normalizeIn = (a: Degree, b: Degree) => {
  return (θ: Degree): Degree => {
    const range = b - a
    const normalized = ((θ - a) % range + range) % range + a
    return Number(normalized.toFixed(5))
  }
}

/**
 * Convert hour angle to degrees
 * @param h - hour angle
 * @returns angle in degrees
 */
export const hoursToDegrees = (h: number) => h * 15

/**
 * Convert degrees to hour angle
 * @param d - degrees
 * @returns hour angle
 */
export const degreesToHours = (d: Degree) => d / 15
