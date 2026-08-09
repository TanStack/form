import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  injectForm,
  injectSelector,
} from '@tanstack/angular-form'
import { AddressFieldsComponent } from './address-fields.component'
import { EmergencyContactComponent } from './emergency-contact.component'
import { peopleFormOptions } from './shared-form'
import { TextFieldComponent } from './text-field.component'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AddressFieldsComponent,
    EmergencyContactComponent,
    TanStackAppField,
    TanStackField,
    TextFieldComponent,
  ],
  template: `
    <main>
      <form (submit)="handleSubmit($event)">
        <h1>Personal Information</h1>
        @for (field of personalFields; track field.name) {
          <app-text-field
            [label]="field.label"
            tanstack-app-field
            [tanstackField]="form"
            [name]="field.name"
          />
        }
        <app-address-fields [form]="form" />
        <app-emergency-contact
          [form]="form"
          [fields]="{
            fullName: 'emergencyContact.fullName',
            phone: 'emergencyContact.phone',
          }"
        />
        <button type="submit" [disabled]="isSubmitting()">
          {{ isSubmitting() ? '...' : 'Submit' }}
        </button>
      </form>
    </main>
  `,
})
export class AppComponent {
  personalFields = [
    { name: 'fullName' as const, label: 'Full Name' },
    { name: 'email' as const, label: 'Email' },
    { name: 'phone' as const, label: 'Phone' },
  ]
  form = injectForm({
    ...peopleFormOptions,
    onSubmit: ({ value }) => alert(JSON.stringify(value, null, 2)),
  })
  isSubmitting = injectSelector(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.form.handleSubmit()
  }
}
