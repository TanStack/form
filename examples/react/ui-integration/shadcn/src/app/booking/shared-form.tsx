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

// createFormValidator
// TODO: Add overload for `formOptions` to type the name fo the APIs
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

// formOptions ->
// formOptions that we know
// formOptions.schema()
// formOptions.nullableSchema()

// The filter callback, what's its type?
// -> ({formApi, fieldApi}) => boolean
//
// formApi.store -> values, formMeta, isValidating,

// formApi => formApi.meta.errors
// // Call when this changes
// formApi.meta.errors;
// // Don't call when this changes
// formApi.values;

// formApi: new Proxy(ogFormApi, { get(): {} })

export const bookingFormOptions = appFormOptions.schema({
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

// formOptions.schema.createFormHook <- formOptions.schema() but as useForm

// useForm(formOptions.schema({}))
// const fieldOne = fieldOptions({formOpts, name: 'name', { listeners: [] }}) // `formOpts` and `name` are optional
// -> formOpts is passed -> name is required
//    benefit: listeners can properly type and what have you

// no formOpts -> no name, where does the value type come from?

// fieldOptions<string>({}) // 1
// fieldOptions({formOpts, name: "name"}) // 2

// type MyField = ReactFieldType<typeof formOpts, typeof fieldOne>

// function SpecificSubForm(props: SpecificSubFormProps) {
//   // ...
//   return <></>
// }

// function MySectionA(props: { form: MyForm }) {
//   return <></>
// }

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
