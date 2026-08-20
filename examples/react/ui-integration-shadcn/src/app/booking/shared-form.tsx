import { createValidator } from '@tanstack/react-form'
import { bookingFormSchema } from './schema'
import type { ReactNode } from 'react'
import type { ReactFormType } from '@tanstack/react-form'
import { appFormOptions } from '@/components/form/app-form'
import { FieldGroup } from '@/components/ui/field'

// form.FormGroup instead of FormGroup form={form}

export const formGroupId = 'booking-form-step' as const

export interface StepFormProps {
  onSubmit: () => void
  children: ReactNode
}
export function StepForm(props: StepFormProps) {
  return (
    <form
      id={formGroupId}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void props.onSubmit()
      }}
    >
      <FieldGroup>{props.children}</FieldGroup>
    </form>
  )
}

export const rewardEarlyPunishLate = createValidator({
  triggers: [
    'blur',
    {
      trigger: 'change',
      when: ({ fieldApi }) => fieldApi !== undefined && fieldApi.meta.isInvalid,
    },
  ],
})

export const bookingFormOptions = appFormOptions.strictSchema(
  bookingFormSchema,
  {
    errorVisibility: ({ state, fieldState }) =>
      fieldState.meta.isBlurred || state.submissionAttempts > 0,
    validators: [rewardEarlyPunishLate(bookingFormSchema)],
    defaultValues: {
      guestDetails: {
        name: '',
        email: '',
        phoneNumber: '',
        guestCount: 1,
      },
      stayDates: {
        dateRange: {
          from: undefined,
          to: undefined,
        },
        arrivalTime: '',
      },
      roomPreferences: {
        roomType: 'standard',
        bedPreference: 'queen',
        smokingPreference: 'non-smoking',
        floorPreference: 'no-preference',
      },
      budget: {
        maxNightlyBudget: 200,
        currency: 'USD',
      },
      addOns: {
        includeBreakfast: false,
        airportPickup: false,
        parkingRequired: false,
      },
      specialRequests: {
        notes: '',
      },
    },
  },
)

export type BookingForm = ReactFormType<typeof bookingFormOptions>
