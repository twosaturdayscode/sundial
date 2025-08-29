import { expect } from 'jsr:@std/expect'

import { Coordinates } from './coordinates.ts'

const DATE = new Date('2025-01-01T12:00:00Z')

/**
 * Taken from https://gml.noaa.gov/grad/solcalc/azel.html
 * for the date 2025-01-01T12:00:00Z
 *
 * Another useful tool: https://astropixels.com/ephemeris/sun/sun2024.html
 */
const declination_ref = -22.96
const EqT_ref = -3.67 // minutes

Deno.test('Given a Date, it returns the Solar declination', () => {
  const c = Coordinates.On(DATE)

  expect(c.declination).toBeCloseTo(declination_ref, 1)
})

Deno.test('Given a Date, it returns the Equation of Time', () => {
  const c = Coordinates.On(DATE)

  expect(c.EqT).toBeCloseTo(EqT_ref / 60, 1)
})

Deno.test('Given another Date, returns the Equation of Time', () => {
  const c = Coordinates.On(new Date('2025-02-09T12:00:00Z'))

  expect(c.EqT).toBeCloseTo(-14.08 / 60, 1)
})
