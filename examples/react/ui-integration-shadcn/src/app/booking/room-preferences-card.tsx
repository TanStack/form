import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { roomPreferencesSchema } from './schema'
import type { BookingForm } from './shared-form'

interface RoomPreferencesCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function RoomPreferencesCard({
  form,
  onGroupSubmit,
}: RoomPreferencesCardProps) {
  return (
    <form.FormGroup
      name="roomPreferences"
      validators={[rewardEarlyPunishLate(roomPreferencesSchema)]}
      onSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <group.Field name="roomType">
            {(field) => (
              <field.Field>
                <field.Label>Room type</field.Label>
                <field.Select
                  field={field}
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'deluxe', label: 'Deluxe' },
                    { value: 'suite', label: 'Suite' },
                    { value: 'penthouse', label: 'Penthouse' },
                  ]}
                />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
          <group.Field name="bedPreference">
            {(field) => (
              <field.Field>
                <field.Label>Bed preference</field.Label>
                <field.Select
                  field={field}
                  options={[
                    { value: 'single', label: 'Single' },
                    { value: 'queen', label: 'Queen' },
                    { value: 'king', label: 'King' },
                    { value: 'twin', label: 'Twin' },
                  ]}
                />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
          <group.Field name="smokingPreference">
            {(field) => (
              <field.Field>
                <field.Label>Smoking preference</field.Label>
                <field.Select
                  field={field}
                  options={[
                    { value: 'non-smoking', label: 'Non-smoking' },
                    { value: 'smoking', label: 'Smoking' },
                  ]}
                />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
          <group.Field name="floorPreference">
            {(field) => (
              <field.Field>
                <field.Label>Floor preference</field.Label>
                <field.Select
                  field={field}
                  options={[
                    { value: 'low', label: 'Lower floor' },
                    { value: 'high', label: 'Higher floor' },
                    { value: 'no-preference', label: 'No preference' },
                  ]}
                />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
        </StepForm>
      )}
    </form.FormGroup>
  )
}

export default RoomPreferencesCard
