import { arcsin, arctan2, cos, normalizeIn, sin } from '../trigonometry.ts'

import { Julian } from '../date/julian.ts'

const normalize = normalizeIn(0, 360)

/**
 * Represents the celestial coordinates of a point in the sky.
 */
export class Coordinates {
  constructor(readonly date: Date) {}

  static On(date: Date): Coordinates {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return new Coordinates(d)
  }

  /**
   * Number of days since J2000.0 epoch (Jan 1, 2000, 12:00 TT).
   */
  get D(): number {
    return Math.ceil(Julian.FromGregorian(this.date).SinceJ2000.Day + 0.0008)
  }

  /**
   * Obliquity of the ecliptic (Earth's axial tilt) in degrees.
   */
  get ε(): number {
    return 23.4397 - 0.00000036 * this.D
  }

  /**
   * Mean longitude of the Sun (degrees).
   */
  get L(): number {
    return normalize(280.459 + 0.98564736 * this.D)
  }

  /**
   * Mean anomaly of the Sun (degrees).
   */
  get g(): number {
    return normalize(357.529 + 0.98560028 * this.D)
  }

  /**
   * Equation of center (correction for Sun's elliptical orbit).
   */
  get EqC(): number {
    return 1.914 * sin(this.g) + 0.0200 * sin(2 * this.g) +
      0.0003 * sin(3 * this.g)
  }

  /**
   * True ecliptic longitude of the Sun (degrees).
   */
  get λ(): number {
    return normalize(this.L + this.EqC)
  }

  /**
   * Right ascension of the Sun (hours).
   */
  get RA(): number {
    const ra = arctan2(cos(this.ε) * sin(this.λ), cos(this.λ)) / 15
    return (ra + 24) % 24
  }

  /**
   * Declination of the Sun (degrees).
   */
  get declination(): number {
    return arcsin(sin(this.ε) * sin(this.λ))
  }

  /**
   * Equation of time (difference between solar time and mean time, in hours).
   */
  get EqT(): number {
    return this.L / 15 - this.RA
  }
}
