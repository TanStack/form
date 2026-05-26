import { FormGroup } from '@tanstack/react-form/form-group'
import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { guestDetailsSchema } from './schema'
import type { BookingForm } from './shared-form'

interface GuestDetailsCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function GuestDetailsCard({ form, onGroupSubmit }: GuestDetailsCardProps) {
  return (
    <FormGroup
      form={form}
      name="guestDetails"
      validators={[rewardEarlyPunishLate(guestDetailsSchema)]}
      onGroupSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <form.Field name="guestDetails.name">
            {(field) => {
              // field.errors -> DISPLAYED ERRORS
              field.meta.original.errors

              // Store Derived
              // -> callback for filtering errors
              // ({ formApi }) => formApi.state.submissionAttempts > 0
              // get state() { return formApi.store.get() }

              return (
                <field.Field>
                  <field.Label>Guest name</field.Label>
                  <field.TextInput placeholder="John Doe" />
                  <field.Error />
                </field.Field>
              )
            }}
          </form.Field>
          <form.Field name="guestDetails.phoneNumber">
            {(field) => <field.TextInputField label="Phone number" />}
          </form.Field>
          <form.Field name="guestDetails.email">
            {(field) => (
              <field.Field>
                <field.Label>Email</field.Label>
                <field.TextInput type="email" placeholder="m@example.com" />
                <field.Error />
                <field.Description>
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </field.Description>
              </field.Field>
            )}
          </form.Field>
          <form.Field name="guestDetails.guestCount">
            {(field) => (
              <field.Field>
                <field.Label>
                  Number of guests:
                  <span>{field.value}</span>
                </field.Label>
                <field.IntegerSlider min={1} max={6} step={1} />
                <field.Error />
              </field.Field>
            )}
          </form.Field>
        </StepForm>
      )}
    </FormGroup>
  )
}

export default GuestDetailsCard
