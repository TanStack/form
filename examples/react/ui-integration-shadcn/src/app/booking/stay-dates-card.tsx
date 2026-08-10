import { useState } from 'react'
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
    <form.FormGroup
      name="stayDates"
      validators={[rewardEarlyPunishLate(stayDatesSchema)]}
      onSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          {/**
           * Reserved name from React, don't use it
           *
           * Rename maybe? See AI proposals or smth
           */}
          <group.Field name="dateRange" errorBoundary>
            {(field) => (
              <field.Field>
                <field.Label>Stay dates</field.Label>
                <field.DateRangePicker disabled={matchPastDays} />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
          <group.Field name="arrivalTime">
            {(field) => (
              <field.Field>
                <field.Label>Arrival time</field.Label>
                <field.TextInput type="time" />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
        </StepForm>
      )}
    </form.FormGroup>
  )
}

export default StayDatesCard
