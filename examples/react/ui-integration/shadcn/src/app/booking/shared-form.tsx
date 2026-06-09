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
      when: ({ triggerFieldApi }) =>
        triggerFieldApi !== undefined && triggerFieldApi.meta.isInvalid,
    },
  ],
})

export const bookingFormOptions = appFormOptions.strictSchema({
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
})

export type BookingForm = ReactFormType<typeof bookingFormOptions>

// TODO field groups!!!
// -> password
//      - FieldWithValue<string> doesn't work, we need to render and give it options at the field group site
//      - fieldOne doesn't work because it's bound to only a single form type, two forms can't share it
// -> confirm_password linked to password

// function MyFieldSection(props: { field: FieldWithValue<string> }) {
//   props.field.value
//   props.field.handleChange('')
//   props.field.errors.map((e) => e.message)
//   // string -> { message: string }
//   // field => (<></>)
// }

// function App() {
//   const form = useForm({ defaultValues: { name: '' }, validators: [] as const })

//   return (
//     <>
//       <MySectionA form={form} />
//       <SpecificSubForm
//       // field1={form.fields[fieldOne.name]}
//       />

//       <form.Field
//       // {...fieldOne}
//       />
//     </>
//   )
// }
