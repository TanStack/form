import { FormGroup } from '@tanstack/react-form/form-group'
import { StepForm, rewardEarlyPunishLate } from './shared-form'
import { budgetSchema } from './schema'
import type { BookingForm } from './shared-form'

interface BudgetCardProps {
  form: BookingForm
  onGroupSubmit: () => void
}

function BudgetCard({ form, onGroupSubmit }: BudgetCardProps) {
  return (
    <FormGroup
      form={form}
      name="budget"
      validators={[rewardEarlyPunishLate(budgetSchema)]}
      onGroupSubmit={onGroupSubmit}
    >
      {(group) => (
        <StepForm onSubmit={group.handleSubmit}>
          <form.Field name="budget.maxNightlyBudget">
            {(field) => (
              <field.Field>
                <field.Label>Maximum nightly budget</field.Label>
                <field.NumberInput min={1} />
                <field.Error />
              </field.Field>
            )}
          </form.Field>
          <form.Field name="budget.currency">
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
          </form.Field>
        </StepForm>
      )}
    </FormGroup>
  )
}

export default BudgetCard
