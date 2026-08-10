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
    <form.FormGroup
      name="specialRequests"
      validators={[rewardEarlyPunishLate(specialRequestsSchema)]}
      onSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <group.Field name="notes">
            {(field) => (
              <field.Field>
                <field.Label>Notes</field.Label>
                <field.TextArea placeholder="Accessibility needs, arrival notes, or celebration details" />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
        </StepForm>
      )}
    </form.FormGroup>
  )
}

export default SpecialRequestsCard
