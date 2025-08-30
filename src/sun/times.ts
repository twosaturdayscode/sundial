import { FormattedHours } from '../formatting.ts'

import { Angle } from './angle.ts'
import { Coordinates } from './coordinates.ts'

/**
 * Astronomical sunrise and sunset occur at α=0. However, due to the refraction
 * of light by terrestrial atmosphere, actual sunrise appears slightly before
 * astronomical sunrise and actual sunset occurs after astronomical sunset.
 */
const ZERO_ANGLE = 0.833

/**
 * Represents the times of solar events (sunrise, sunset, etc.) for a specific
 * location and date.
 */
export class Times {
  static On(date: Date): { At(lat: number, lon: number, alt?: number): Times } {
    return {
      At: (lat: number, lon: number, alt?: number): Times => {
        const position: [number, number, number?] = [lat, lon, alt]
        const coordinates = Coordinates.On(date)
        const angle = Angle.On(date, [lat])

        return new Times(coordinates, angle, position)
      }
    }
  }

  private constructor(
    private readonly coordinates: Coordinates,
    private readonly angle: Angle,
    private readonly position: [number, number, number?]
  ) {
  }

  /**
   * Computes the local true midday (solar noon) for this location
   *
   * @returns Solar noon in hours (decimal)
   */
  get Noon(): FormattedHours {
    const [, longitude] = this.position
    const h = 12 - longitude / 15 - this.coordinates.EqT
    return FormattedHours.FromDecimal(h)
  }

  /**
   * Computes the time of sunrise for this location and date
   *
   * @param alt Optional altitude of the observer above sea level in meters
   * @returns Time of sunrise in hours (decimal)
   */
  get Sunrise(): FormattedHours {
    const [, , alt] = this.position
    const h0 = ZERO_ANGLE - 0.0347 * Math.sqrt(alt ?? 0)

    const h = this.Noon.Hours - this.angle.HourAt(h0) / 15

    return FormattedHours.FromDecimal(h)
  }

  /**
   * Computes the time of sunset for this location and date
   *
   * @param alt Optional altitude of the observer above sea level in meters
   * @returns Time of sunset in hours (decimal)
   */
  get Sunset(): FormattedHours {
    const [, , alt] = this.position
    const h0 = ZERO_ANGLE - 0.0347 * Math.sqrt(alt ?? 0)
    const h = this.Noon.Hours + this.angle.HourAt(h0) / 15

    return FormattedHours.FromDecimal(h)
  }

  /**
   * Computes the total day length (duration between sunrise and sunset)
   *
   * @param alt Optional altitude of the observer above sea level in meters
   * @returns Day length in hours
   */
  get DayLength(): FormattedHours {
    // const h0 = ZERO_ANGLE - 0.0347 * Math.sqrt(this.altitude || 0)
    // return 2 * (this.HourAngleAt(h0) / 15)

    const h = this.Sunset.Hours - this.Sunrise.Hours

    return FormattedHours.FromDecimal(h)
  }
}
