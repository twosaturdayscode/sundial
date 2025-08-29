import { expect } from 'jsr:@std/expect'

import { Julian } from './julian.ts'

Deno.test(
  'converts Gregorian date to Julian Day Number (JDN) correctly',
  () => {
    // January 1, 2000, 12:00 UTC is J2000.0, JDN = 2451545
    const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0, 0))
    const julian = Julian.FromGregorian(date)
    expect(julian.Day).toBe(2451545)
    expect(julian.Date).toBeCloseTo(2451545.0)
  },
)

Deno.test('returns correct Julian Day Number for a random date', () => {
  // July 20, 1969, 20:18 UTC (Apollo 11 landing)
  const date = new Date(Date.UTC(1969, 6, 20, 20, 18, 0, 0))
  const julian = Julian.FromGregorian(date)
  expect(julian.Day).toBe(2440423)
  expect(julian.Date).toBeCloseTo(2440423.34583, 4)
})

Deno.test('converts Julian Date back to Gregorian date correctly', () => {
  const date = new Date(Date.UTC(2023, 2, 21, 0, 0, 0, 0))
  const julian = Julian.FromGregorian(date)
  const gregorian = julian.toGregorian()
  expect(gregorian.getUTCFullYear()).toBe(2023)
  expect(gregorian.getUTCMonth()).toBe(2)
  expect(gregorian.getUTCDate()).toBe(21)
  expect(gregorian.getUTCHours()).toBe(0)
  expect(gregorian.getUTCMinutes()).toBe(0)
})

Deno.test('calculates Julian centuries since J2000.0 correctly', () => {
  const date = new Date(Date.UTC(2100, 0, 1, 12, 0, 0, 0))
  const julian = Julian.FromGregorian(date)
  expect(julian.toJulianCentury()).toBeCloseTo(1.0)
})

Deno.test('calculates Modified Julian Date (MJD) correctly', () => {
  const date = new Date(Date.UTC(1858, 10, 17, 0, 0, 0, 0)) // MJD epoch
  const julian = Julian.FromGregorian(date)
  expect(julian.toModifiedJD()).toBeCloseTo(0.0)
})

Deno.test('Julian.Day.Of returns correct Julian Day Number', () => {
  // January 1, 2000, 12:00 UTC is J2000.0, JDN = 2451545
  const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0, 0))
  const jdn = Julian.Day.Of(date)
  expect(jdn).toBe(2451545)

  // July 20, 1969, 20:18 UTC
  const apolloDate = new Date(Date.UTC(1969, 6, 20, 20, 18, 0, 0))
  const apolloJdn = Julian.Day.Of(apolloDate)
  expect(apolloJdn).toBe(2440423)
})

Deno.test('Julian.Date.Of returns correct Julian Date (JD)', () => {
  // January 1, 2000, 12:00 UTC is J2000.0, JD = 2451545.0
  const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0, 0))
  const jd = Julian.Date.Of(date)
  expect(jd).toBeCloseTo(2451545.0)

  // July 20, 1969, 20:18 UTC
  const apolloDate = new Date(Date.UTC(1969, 6, 20, 20, 18, 0, 0))
  const apolloJd = Julian.Date.Of(apolloDate)
  expect(apolloJd).toBeCloseTo(2440423.34583, 4)
})

Deno.test('Gregorian → JD → Gregorian round trip (modern date)', () => {
  const date = new Date(Date.UTC(2025, 7, 29, 18, 30, 15, 123)) // 2025-08-29 18:30:15.123 UTC
  const julian = Julian.FromGregorian(date)

  const back = julian.toGregorian()

  expect(back.toISOString()).toBe(date.toISOString())
})

Deno.test('Gregorian → JD → Gregorian round trip (Gregorian reform boundary)', () => {
  const date = new Date(Date.UTC(1582, 9, 15)) // 1582-10-15 (first day of Gregorian calendar)
  const julian = Julian.FromGregorian(date)

  const back = julian.toGregorian()

  expect(back.toISOString()).toBe(date.toISOString())
})

Deno.test('Julian Day Number matches known epoch (J2000.0)', () => {
  // J2000.0 = 2000-01-01 12:00 TT (approx UTC)
  const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0, 0))
  const julian = Julian.FromGregorian(date)

  // JD for J2000.0 should be 2451545.0
  expect(Math.abs(julian.Date - 2451545.0)).toBeLessThan(1e-9)
})

Deno.test('Modified Julian Date check', () => {
  const date = new Date(Date.UTC(2025, 7, 29, 0, 0, 0, 0))
  const julian = Julian.FromGregorian(date)

  // MJD = JD - 2400000.5
  const expected = julian.Date - 2400000.5
  expect(julian.toModifiedJD()).toBeCloseTo(expected, 10)
})

Deno.test("Gregorian → JD → Gregorian round trip (1 BCE / astronomical year 0)", () => {
  // Astronomical year 0 = 1 BCE (historical)
  const date = new Date(Date.UTC(0, 0, 1, 0, 0, 0, 0)) // 0000-01-01 UTC
  const julian = Julian.FromGregorian(date)

  const back = julian.toGregorian()

  expect(back.toISOString()).toBe(date.toISOString())
})
