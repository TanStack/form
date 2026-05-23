import z from 'zod'
import type { DateRange } from 'react-day-picker'

const completeSchemaCheck = z.object({ from: z.date(), to: z.date() })

const dateRangeSchema = z.custom<DateRange>(
  (data) => completeSchemaCheck.safeParse(data).success,
  'Please select a date range.',
)

export const bookingFormSchema = z.object({
  guestDetails: z.object({
    name: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    guestCount: z.int().min(1).max(6),
  }),
  stayDates: z.object({
    dateRange: dateRangeSchema,
  }),
})
