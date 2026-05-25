import { FormGroup } from '@tanstack/react-form/form-group'
import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { specialRequestsSchema } from './schema'
import type { BookingForm } from './shared-form'

interface SpecialRequestsCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function SpecialRequestsCard({
  form,
  onGroupSubmit,
}: SpecialRequestsCardProps) {
  return (
    <FormGroup
      form={form}
      name="specialRequests"
      validators={[rewardEarlyPunishLate(specialRequestsSchema)]}
      onGroupSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <form.Field name="specialRequests.notes">
            {(field) => (
              <field.Field>
                <field.Label>Notes</field.Label>
                <field.TextArea placeholder="Accessibility needs, arrival notes, or celebration details" />
                <field.Error />
              </field.Field>
            )}
          </form.Field>
        </StepForm>
      )}
    </FormGroup>
  )
}

export default SpecialRequestsCard
