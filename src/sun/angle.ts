import { Coordinates } from './coordinates.ts'

import { arccos, arccot, cos, sin, tan } from '../trigonometry.ts'

export class Angle {
  static On(date: Date, position: [number]): Angle {
    return new Angle(Coordinates.On(date), position)
  }

  constructor(
    private readonly coordinates: Coordinates,
    private readonly position: [number]
  ) {
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
