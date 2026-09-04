import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  TanStackWithForm,
  injectForm,
  injectStore,
} from '@tanstack/angular-form'
import { TextField } from './components/text-field.component'
import { AddressFields } from './features/people/address-fields.component'
import { EmergencyContact } from './features/people/emergency-contact.component'
import { peopleFormOpts } from './features/people/shared-form'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TanStackField,
    TanStackAppField,
    TanStackWithForm,
    TextField,
    AddressFields,
    EmergencyContact,
  ],
  template: `
    <form (submit)="handleSubmit($event)">
      <h1>Personal Information</h1>
      <app-text-field
        label="Full Name"
        tanstack-app-field
        [tanstackField]="form"
        name="fullName"
      />
      <app-text-field
        label="Email"
        tanstack-app-field
        [tanstackField]="form"
        name="email"
      />
      <app-text-field
        label="Phone"
        tanstack-app-field
        [tanstackField]="form"
        name="phone"
      />

      <app-address-fields tanstack-with-form [form]="form" />

      <h2>Emergency Contact</h2>
      <app-emergency-contact tanstack-with-form [form]="form" />

      <button type="submit" [disabled]="isSubmitting()">
        {{ isSubmitting() ? '...' : 'Submit' }}
      </button>
    </form>
  `,
})
export class AppComponent {
  form = injectForm({
    ...peopleFormOpts,
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  isSubmitting = injectStore(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
