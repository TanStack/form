import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { TanStackAppField, TanStackField } from '@tanstack/angular-form'
import { TextFieldComponent } from './text-field.component'
import type { AngularFormType } from '@tanstack/angular-form'
import type { peopleFormOptions } from './shared-form'

@Component({
  selector: 'app-emergency-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackAppField, TanStackField, TextFieldComponent],
  template: `
    <section>
      <h2>Emergency Contact</h2>
      <app-text-field
        label="Full Name"
        tanstack-app-field
        [tanstackField]="form()"
        [name]="fields().fullName"
      />
      <app-text-field
        label="Phone"
        tanstack-app-field
        [tanstackField]="form()"
        [name]="fields().phone"
      />
    </section>
  `,
})
export class EmergencyContactComponent {
  form = input.required<AngularFormType<typeof peopleFormOptions>>()
  fields = input.required<{
    fullName: 'emergencyContact.fullName'
    phone: 'emergencyContact.phone'
  }>()
}
