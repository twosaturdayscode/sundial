import { expect } from 'jsr:@std/expect'

import { Times } from './times.ts'

const DATE = new Date('2025-01-01T12:00:00Z')

Deno.test('Given a Date, it return day length', () => {
  const times = Times.On(DATE).At(45.46416, 9.19199)

  const h = times.DayLength.ClockWithSeconds

  expect(h).toBe('08:47:24')
})

Deno.test('Given a Date, it return sunrise time', () => {
  const times = Times.On(DATE).At(45.46416, 9.19199)

  const h = times.Sunrise.ClockWithSeconds

  expect(h).toBe('07:03:12')
})

Deno.test('Given a Date, it return sunset time', () => {
  const times = Times.On(DATE).At(45.46416, 9.19199)

  const h = times.Sunset.ClockWithSeconds

  expect(h).toBe('15:50:37')
})
