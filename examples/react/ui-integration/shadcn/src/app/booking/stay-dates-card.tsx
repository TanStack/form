import { useState } from 'react'
import { FormGroup } from '@tanstack/react-form/form-group'
import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { stayDatesSchema } from './schema'
import type { BookingForm } from './shared-form'
import type { Matcher } from 'react-day-picker'

interface StayDatesCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function StayDatesCard({ form, onGroupSubmit }: StayDatesCardProps) {
  const [matchPastDays] = useState<Matcher>(() => ({
    before: new Date(),
  }))

  return (
    <FormGroup
      form={form}
      name="stayDates"
      validators={[rewardEarlyPunishLate(stayDatesSchema)]}
      onGroupSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <form.Field name="stayDates.dateRange" errorBoundary>
            {(field) => (
              <field.Field>
                <field.Label>Stay dates</field.Label>
                <field.DateRangePicker disabled={matchPastDays} />
                <field.Error />
              </field.Field>
            )}
          </form.Field>
          <form.Field name="stayDates.arrivalTime">
            {(field) => (
              <field.Field>
                <field.Label>Arrival time</field.Label>
                <field.TextInput type="time" />
                <field.Error />
              </field.Field>
            )}
          </form.Field>
        </StepForm>
      )}
    </FormGroup>
  )
}

export default StayDatesCard
