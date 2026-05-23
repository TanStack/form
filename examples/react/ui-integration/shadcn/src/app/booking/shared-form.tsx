import { bookingFormSchema } from './schema'
import type { ReactFormType } from '@tanstack/react-form'
import { appFormOptions } from '@/components/form/app-form'

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
