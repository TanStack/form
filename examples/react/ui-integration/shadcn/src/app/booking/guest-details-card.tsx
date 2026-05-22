import type { BookingForm } from './shared-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'

interface GuestDetailsCardProps {
  form: BookingForm
}

export function GuestDetailsCard({ form }: GuestDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest details</CardTitle>
        <CardDescription>Enter your information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form.Form>
          <FieldGroup>
            <form.Field name="guestDetails.name">
              {(field) => (
                <field.Field>
                  <field.Label>Guest name</field.Label>
                  <field.TextInput placeholder="John Doe" />
                  <field.Error />
                </field.Field>
              )}
            </form.Field>
            {/** Since the composition above is quite common, you can create a "preset" for quick setup */}
            <form.Field name="guestDetails.phoneNumber">
              {(field) => <field.TextInputField label="Phone number" />}
            </form.Field>
            {/** But you can stick to granular components for the exceptions where more control is needed */}
            <form.Field name="guestDetails.email">
              {(field) => (
                <field.Field>
                  <field.Label>Email</field.Label>
                  <field.TextInput type="email" placeholder="m@example.com" />
                  <field.Error />
                  <field.Description>
                    We&apos;ll use this to contact you. We will not share your
                    email with anyone else.
                  </field.Description>
                </field.Field>
              )}
            </form.Field>
          </FieldGroup>
        </form.Form>
      </CardContent>
    </Card>
  )
}
