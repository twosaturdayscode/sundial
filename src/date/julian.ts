export class Julian {
  static Day = {
    /**
     * Convert a Gregorian calendar date to Julian Day Number (JDN)
     * using the Fliegel–Van Flandern algorithm.
     *
     * This version avoids floating-point operations (like 365.25),
     * making it robust and exact across a very wide date range.
     *
     * @param date - The Gregorian date to convert
     * @returns The Julian Day Number
     */
    Of(date: Date): number {
      const Y = date.getUTCFullYear()
      const M = date.getUTCMonth() + 1 // JS months are 0-based
      const D = date.getUTCDate()

      // Shift January and February to be the 13th/14th month of the previous year
      const a = Math.floor((14 - M) / 12)
      const y = Y + 4800 - a
      const m = M + 12 * a - 3

      // Apply the formula
      return D +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045
    }
  }

  static Date = {
    /**
     * Convert a Gregorian date to Julian Date
     * @param date - The Gregorian date to convert
     * @returns The Julian Date (i.e. JD - The Julian Day Number added with time of day)
     */
    Of(date: Date): number {
      const hour = date.getUTCHours()
      const minute = date.getUTCMinutes()
      const second = date.getUTCSeconds()
      const millisecond = date.getUTCMilliseconds()

      const jdn = Julian.Day.Of(date)

      // Add time of day
      const dayFraction =
        (hour + minute / 60 + second / 3600 + millisecond / 3600000) / 24

      return jdn + dayFraction - 0.5
    }
  }

  static FromGregorian(date: Date): Julian {
    const jdate = Julian.Date.Of(date)
    return new Julian(jdate)
  }

  constructor(readonly jdate: number) {}

  get Day(): number {
    return Math.floor(this.jdate)
  }

  get SinceJ2000(): { Day: number; Century: number } {
    const days = this.jdate - 2451545
    return { Day: days, Century: days / 36525 }
  }

  get Date(): number {
    return this.jdate
  }

  /**
   * Convert Julian Date (JD) to Gregorian Date (UTC).
   *
   * Uses the Fliegel–Van Flandern algorithm for the integer day conversion
   * (robust integer math for Y/M/D), and then adds back the fractional
   * part of the day to recover hours, minutes, seconds, and milliseconds.
   */
  toGregorian(): Date {
    // Step 1. Shift so days start at midnight, not noon
    const jd = this.jdate + 0.5

    // Step 2. Split into integer JDN and fractional day
    const Z = Math.floor(jd) // Julian Day Number (integer part)
    const F = jd - Z // Fractional part of the day

    // Step 3. Convert JDN → Gregorian Y/M/D using Fliegel–Van Flandern
    const f = Z + 1401 +
      Math.floor((Math.floor((4 * Z + 274277) / 146097) * 3) / 4) - 38

    const e = 4 * f + 3
    const g = Math.floor((e % 1461) / 4)
    const h = 5 * g + 2

    const day = Math.floor((h % 153) / 5) + 1
    const month = ((Math.floor(h / 153) + 2) % 12) + 1
    const year = Math.floor(e / 1461) - 4716 + Math.floor((12 + 2 - month) / 12)

    // Step 4. Convert fractional day → time of day
    let dayFraction = F
    if (dayFraction < 0) dayFraction += 1 // handle numerical drift

    const hourDecimal = dayFraction * 24
    const hour = Math.floor(hourDecimal)

    const minuteDecimal = (hourDecimal - hour) * 60
    const minute = Math.floor(minuteDecimal)

    const secondDecimal = (minuteDecimal - minute) * 60
    const second = Math.floor(secondDecimal)

    const millisecond = Math.round((secondDecimal - second) * 1000)

    // Step 5. Return final UTC date
    return new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
    )
  }

  /**
   * Convert Julian Date to Julian Centuries since J2000.0
   */
  toJulianCentury(): number {
    return (this.jdate - 2451545.0) / 36525
  }

  /**
   * Get Modified Julian Date (MJD)
   */
  toModifiedJD(): number {
    return this.jdate - 2400000.5
  }
}
