import { arcsin, arctan2, cos, normalizeIn, sin } from '../trigonometry.ts'

import { Julian } from '../date/julian.ts'

const normalize = normalizeIn(0, 360)

export class Coordinates {
  constructor(readonly date: Date) {}

  static On(date: Date): Coordinates {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return new Coordinates(d)
  }

  get D(): number {
    const jd = Julian.Date.Of(this.date)
    return Math.ceil(jd - 2451545.0 + 0.0008)
  }

  get ε(): number {
    return 23.4397 - 0.00000036 * this.D
  }

  get L(): number {
    return normalize(280.459 + 0.98564736 * this.D)
  }

  get g(): number {
    return normalize(357.529 + 0.98560028 * this.D)
  }

  get EqC(): number {
    return 1.914 * sin(this.g) + 0.0200 * sin(2 * this.g) +
      0.0003 * sin(3 * this.g)
  }

  get λ(): number {
    return normalize(this.L + this.EqC)
  }

  get RA(): number {
    const ra = arctan2(cos(this.ε) * sin(this.λ), cos(this.λ)) / 15
    return (ra + 24) % 24
  }

  get declination(): number {
    return arcsin(sin(this.ε) * sin(this.λ))
  }

  get EqT(): number {
    return this.L / 15 - this.RA
  }
}
