import { FormGroup } from '@tanstack/react-form/form-group'
import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { addOnsSchema } from './schema'
import type { BookingForm } from './shared-form'

interface AddOnsCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function AddOnsCard({ form, onGroupSubmit }: AddOnsCardProps) {
  return (
    <FormGroup
      form={form}
      name="addOns"
      validators={[rewardEarlyPunishLate(addOnsSchema)]}
      onGroupSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <form.Field name="addOns.includeBreakfast">
            {(field) => (
              <field.Field orientation="horizontal">
                <field.Checkbox />
                <field.Label>Include breakfast</field.Label>
              </field.Field>
            )}
          </form.Field>
          <form.Field name="addOns.airportPickup">
            {(field) => (
              <field.Field orientation="horizontal">
                <field.Checkbox />
                <field.Label>Airport pickup</field.Label>
              </field.Field>
            )}
          </form.Field>
          <form.Field name="addOns.parkingRequired">
            {(field) => (
              <field.Field orientation="horizontal">
                <field.Checkbox />
                <field.Label>Parking required</field.Label>
              </field.Field>
            )}
          </form.Field>
        </StepForm>
      )}
    </FormGroup>
  )
}

export default AddOnsCard
