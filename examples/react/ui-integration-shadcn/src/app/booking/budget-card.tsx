import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { budgetSchema } from './schema'
import type { BookingForm } from './shared-form'

interface BudgetCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function BudgetCard({ form, onGroupSubmit }: BudgetCardProps) {
  return (
    <form.FormGroup
      name="budget"
      validators={[rewardEarlyPunishLate(budgetSchema)]}
      onSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <group.Field name="maxNightlyBudget">
            {(field) => (
              <field.Field>
                <field.Label>Maximum nightly budget</field.Label>
                <field.NumberInput min={1} />
                <field.Error />
              </field.Field>
            )}
          </group.Field>
          <group.Field name="currency">
            {(field) => (
              <field.Field>
                <field.Label>Currency</field.Label>
                <field.Select
                  field={field}
                  options={[
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                    { value: 'GBP', label: 'GBP' },
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

export default BudgetCard
