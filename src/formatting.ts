/**
 * Given a decimal hour representation, returns the hours itself, the number of minutes,
 * seconds, and milliseconds.
 *
 * Also provides a string representation in `HH:MM:SS` format.
 */
export class FormattedHours {
  static FromDecimal(hours: number): FormattedHours {
    return new FormattedHours(hours)
  }

  constructor(private readonly hours: number) {}

  /**
   * Hours in decimal format.
   *
   * i.e. 1 hour, 30 minutes = 1.5 hours
   */
  get Hours(): number {
    return this.hours
  }

  get Clock(): string {
    const h = Math.floor(this.hours)
    const m = Math.floor((this.hours - h) * 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  get ClockWithSeconds(): string {
    const h = Math.floor(this.hours)
    const m = Math.floor((this.hours - h) * 60)
    const s = Math.floor(((this.hours - h) * 60 - m) * 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${
      s.toString().padStart(2, '0')
    }`
  }

  get Minutes(): number {
    return this.hours * 60
  }

  get Seconds(): number {
    return this.Minutes * 60
  }

  get Milliseconds(): number {
    return this.Seconds * 1000
  }
}
