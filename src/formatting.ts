/**
 * Given a decimal hour representation, formats it as hours, minutes, seconds
 * and milliseconds or a string representation.
 */
export class FormattedHours {
  static FromDecimal(hours: number): FormattedHours {
    return new FormattedHours(hours)
  }

  constructor(private readonly hours: number) {}

  get Hours(): number {
    return this.hours
  }

  get String(): string {
    const h = Math.floor(this.hours)
    const m = Math.floor((this.hours - h) * 60)
    const s = Math.floor(((this.hours - h) * 60 - m) * 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${
      s.toString().padStart(2, '0')
    }`
  }

  get Minutes(): number {
    return Math.floor((this.hours - Math.floor(this.hours)) * 60)
  }

  get Seconds(): number {
    return Math.floor(
      ((this.hours - Math.floor(this.hours)) * 60 - this.Minutes) * 60
    )
  }

  get Milliseconds(): number {
    return Math.floor(
      ((this.hours - Math.floor(this.hours)) * 60 - this.Minutes) * 60 * 1000
    )
  }
}
