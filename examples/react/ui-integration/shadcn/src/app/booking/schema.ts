import z from 'zod'
import type { DateRange } from 'react-day-picker'

const completeSchemaCheck = z.object({
  from: z.date('Please select a date range.'),
  to: z.date('Please select a date range.'),
})

const dateRangeSchema = z.custom<DateRange>().pipe(completeSchemaCheck)

export const guestDetailsSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.email('Please enter a valid email address.'),
  phoneNumber: z.string().min(1, 'Please enter a phone number.'),
  guestCount: z.int().min(1).max(6),
})

export const stayDatesSchema = z.object({
  dateRange: dateRangeSchema,
  arrivalTime: z.string().min(1, 'Please select an arrival time.'),
})

export const roomPreferencesSchema = z.object({
  roomType: z.enum(['standard', 'deluxe', 'suite', 'penthouse']),
  bedPreference: z.enum(['single', 'queen', 'king', 'twin']),
  smokingPreference: z.enum(['non-smoking', 'smoking']),
  floorPreference: z.enum(['low', 'high', 'no-preference']),
})

export const budgetSchema = z.object({
  maxNightlyBudget: z.number().positive('Please enter a nightly budget.'),
  currency: z.enum(['USD', 'EUR', 'GBP']),
})

export const addOnsSchema = z.object({
  includeBreakfast: z.boolean(),
  airportPickup: z.boolean(),
  parkingRequired: z.boolean(),
})

export const specialRequestsSchema = z.object({
  notes: z
    .string()
    .max(500, 'Please keep special requests under 500 characters.'),
})

export const bookingFormSchema = z.object({
  guestDetails: guestDetailsSchema,
  stayDates: stayDatesSchema,
  roomPreferences: roomPreferencesSchema,
  budget: budgetSchema,
  addOns: addOnsSchema,
  specialRequests: specialRequestsSchema,
})

export type HotelStayPreferencesForm = z.input<typeof bookingFormSchema>
