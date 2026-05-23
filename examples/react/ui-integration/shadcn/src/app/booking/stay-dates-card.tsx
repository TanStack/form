import type { BookingForm } from './shared-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'

interface StayDatesCardProps {
  form: BookingForm
}

export function StayDatesCard({ form }: StayDatesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stay dates</CardTitle>
        <CardDescription>
          Enter the dates you will expect to be staying
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.Form>
          <FieldGroup>
            <form.Field name="stayDates.dateRange" errorVisibility="touched">
              {(field) => (
                <field.Field>
                  <field.Label>Stay dates</field.Label>
                  <field.DateRangePicker />
                  <field.Error />
                </field.Field>
              )}
            </form.Field>
          </FieldGroup>
        </form.Form>
      </CardContent>
    </Card>
  )
}
