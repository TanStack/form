import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { guestDetailsSchema } from './schema'
import type { BookingForm } from './shared-form'

interface GuestDetailsCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function GuestDetailsCard({ form, onGroupSubmit }: GuestDetailsCardProps) {
  return (
    <form.FormGroup
      name="guestDetails"
      validators={[rewardEarlyPunishLate(guestDetailsSchema)]}
      onSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <group.Field name="name">
            {(field) => (
              <field.Field>
                <field.Label>Guest name</field.Label>
                <field.TextInput placeholder="John Doe" />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
          <group.Field name="phoneNumber">
            {(field) => <field.TextInputField label="Phone number" />}
          </group.Field>
          <group.Field name="email">
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
          </group.Field>
          <group.Field name="guestCount">
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
          </group.Field>
        </StepForm>
      )}
    </form.FormGroup>
  )
}

export default GuestDetailsCard
