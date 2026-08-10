import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { addOnsSchema } from './schema'
import type { BookingForm } from './shared-form'

interface AddOnsCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function AddOnsCard({ form, onGroupSubmit }: AddOnsCardProps) {
  return (
    <form.FormGroup
      name="addOns"
      validators={[rewardEarlyPunishLate(addOnsSchema)]}
      onSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <group.Field name="includeBreakfast">
            {(field) => (
              <field.Field orientation="horizontal">
                <field.Checkbox />
                <field.Label>Include breakfast</field.Label>
              </field.Field>
            )}
          </group.Field>
          <group.Field name="airportPickup">
            {(field) => (
              <field.Field orientation="horizontal">
                <field.Checkbox />
                <field.Label>Airport pickup</field.Label>
              </field.Field>
            )}
          </group.Field>
          <group.Field name="parkingRequired">
            {(field) => (
              <field.Field orientation="horizontal">
                <field.Checkbox />
                <field.Label>Parking required</field.Label>
              </field.Field>
            )}
          </group.Field>
        </StepForm>
      )}
    </form.FormGroup>
  )
}

export default AddOnsCard
