import { Coordinates } from './coordinates.ts'

import { arccos, arccot, cos, sin, tan } from '../trigonometry.ts'

/**
 * Represents the solar angle at specific conditions.
 */
export class Angle {
  static On(date: Date, position: [latitude: number]): Angle {
    return new Angle(Coordinates.On(date), position)
  }

  constructor(
    private readonly coordinates: Coordinates,
    private readonly position: [number]
  ) {}

  /**
   * Computes the hour angle of the Sun for a given altitude
   *
   * @param altitude Sun altitude in degrees
   * @returns Hour angle in degrees
   * @throws If the Sun never rises or never sets on this date at this location
   */
  HourAt(altitude: number): number {
    const [lat] = this.position
    const { declination } = this.coordinates

    const sinH = (-sin(altitude) - sin(lat) * sin(declination)) /
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
   * Computes the solar angle corresponding to a shadow of length t times
   * the object height
   *
   * @param ratio Ratio of shadow length to object height
   * @returns Solar angle in degrees
   */
  AtShadow(ratio: number): number {
    const { declination } = this.coordinates
    const [latitude] = this.position

    return arccos(
      (sin(arccot(ratio + tan(latitude - declination))) -
        sin(latitude) * sin(declination)) /
        (cos(latitude) * cos(declination))
    )
  }
}
