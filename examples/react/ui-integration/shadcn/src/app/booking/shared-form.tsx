import { createValidator } from '@tanstack/react-form'
import { bookingFormSchema } from './schema'
import type { ReactNode } from 'react'
import type { ReactFormType } from '@tanstack/react-form'
import type { HotelStayPreferencesForm } from './schema'
import { appFormOptions } from '@/components/form/app-form'
import { FieldGroup } from '@/components/ui/field'

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
      when: ({ triggerFieldApi }) =>
        triggerFieldApi !== undefined && triggerFieldApi.meta.isInvalid,
    },
  ],
})

export const bookingFormOptions = appFormOptions.schema({
  errorVisibility: 'blurred-or-submit-attempted',
  validators: [rewardEarlyPunishLate(bookingFormSchema)],
  onSubmit: async ({ schemaOutputs: [result] }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('Form was submitted! See logs for result')
    console.log(result)
  },
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
  } satisfies HotelStayPreferencesForm,
})

export type BookingForm = ReactFormType<typeof bookingFormOptions>
