import { Coordinates } from './coordinates.ts'

import { arccos, cos, sin } from '../trigonometry.ts'

/**
 * Astronomical sunrise and sunset occur at α=0. However, due to the refraction
 * of light by terrestrial atmosphere, actual sunrise appears slightly before
 * astronomical sunrise and actual sunset occurs after astronomical sunset.
 */
const ZERO_ANGLE = 0.833

export class Times {
  static Of(
    date: Date,
    position: [latitude: number, longitude: number, altitude?: number]
  ): Times {
    const coordinates = Coordinates.On(date)
    return new Times(coordinates, position)
  }

  private constructor(
    private readonly coordinates: Coordinates,
    private readonly position: [number, number, number?]
  ) {
  }

  /**
   * Computes the hour angle of the Sun for a given altitude
   *
   * @param a Sun altitude in degrees
   * @returns Hour angle in degrees
   * @throws If the Sun never rises or never sets on this date at this location
   */
  private HourAngleAt(a: number) {
    const [lat] = this.position

    const { declination } = this.coordinates
    const sinH = (-sin(a) - sin(lat) * sin(declination)) /
      (cos(lat) * cos(declination))

    if (sinH > 1) {
      throw new Error('Sun never rises at this location on this date')
    }
    if (sinH < -1) {
      throw new Error('Sun never sets at this location on this date')
    }

    return arccos(sinH)
  }

  /**
   * Computes the local true midday (solar noon) for this location
   *
   * @returns Solar noon in hours (decimal)
   */
  private TrueMidday() {
    const [, longitude] = this.position
    return 12 - longitude / 15 - this.coordinates.EqT
  }

  /**
   * Computes the time of sunrise for this location and date
   *
   * @param alt Optional altitude of the observer above sea level in meters
   * @returns Time of sunrise in hours (decimal)
   */
  get Sunrise() {
    const [, , alt] = this.position
    const h0 = ZERO_ANGLE - 0.0347 * Math.sqrt(alt ?? 0)
    const h = this.TrueMidday() - this.HourAngleAt(h0) / 15

    return { Hours: h, String: this.Print(h) }
  }

  /**
   * Computes the time of sunset for this location and date
   *
   * @param alt Optional altitude of the observer above sea level in meters
   * @returns Time of sunset in hours (decimal)
   */
  get Sunset() {
    const [, , alt] = this.position
    const h0 = ZERO_ANGLE - 0.0347 * Math.sqrt(alt ?? 0)
    const h = this.TrueMidday() + this.HourAngleAt(h0) / 15

    return { Hours: h, String: this.Print(h) }
  }

  /**
   * Computes the total day length (duration between sunrise and sunset)
   *
   * @param alt Optional altitude of the observer above sea level in meters
   * @returns Day length in hours
   */
  get DayLength() {
    // const h0 = ZERO_ANGLE - 0.0347 * Math.sqrt(this.altitude || 0)
    // return 2 * (this.HourAngleAt(h0) / 15)

    const h = this.Sunset.Hours - this.Sunrise.Hours

    return {
      Hours: h,
      Minutes: h * 60,
      Seconds: h * 3600,
      Milliseconds: h * 3600 * 1000,
      String: this.Print(h)
    }
  }

  private Print(hours: number) {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    const s = Math.round(((hours - h) * 60 - m) * 60)

    // Pad with zeros for proper formatting
    const hh = h.toString().padStart(2, '0')
    const mm = m.toString().padStart(2, '0')
    const ss = s.toString().padStart(2, '0')

    return `${hh}:${mm}:${ss}`
  }
}
