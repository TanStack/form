import z from 'zod'
import type { DateRange } from 'react-day-picker'
import type { ReactFormType } from '@tanstack/react-form'
import { appFormOptions } from '@/components/form/app-form'

const dateRange = z
  .object({
    // Match react-day-picker's DateRange type
    from: z.union([z.date(), z.undefined()]),
    to: z.date().optional(),
  })
  .pipe(
    z.object({
      from: z.date(),
      to: z.date(),
    }),
  ) satisfies z.ZodType<Required<DateRange>, DateRange> as z.ZodType<
  Required<DateRange>,
  DateRange
>

export const bookingFormSchema = z.object({
  guestDetails: z.object({
    name: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    guestCount: z.int().min(1).max(6),
  }),
  stayDates: z.object({
    dateRange: dateRange,
  }),
})

export const bookingFormOptions = appFormOptions.schema({
  errorVisibility: 'blurred-or-submit-attempted',
  defaultValues: {
    guestDetails: {
      name: '',
      email: '',
      phoneNumber: '',
      guestCount: 1,
    },
    stayDates: {
      dateRange: {
        from: new Date(),
        to: undefined,
      },
    },
  },
  validators: [
    {
      run: bookingFormSchema,
      triggers: [
        'blur',
        {
          trigger: 'change',
          when: ({ triggerFieldApi }) =>
            triggerFieldApi !== undefined && triggerFieldApi.meta.isInvalid,
        },
      ],
    },
  ],
})

export type BookingForm = ReactFormType<typeof bookingFormOptions>
