import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  injectWithForm,
} from '@tanstack/angular-form'
import { TextField } from '../../components/text-field.component'
import { peopleFormOpts } from './shared-form'

@Component({
  selector: 'app-emergency-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField, TanStackAppField, TextField],
  template: `
    <app-text-field
      label="Full Name"
      tanstack-app-field
      [tanstackField]="withForm.form"
      name="emergencyContact.fullName"
    />
    <app-text-field
      label="Phone"
      tanstack-app-field
      [tanstackField]="withForm.form"
      name="emergencyContact.phone"
    />
  `,
})
export class EmergencyContact {
  withForm = injectWithForm({ ...peopleFormOpts })
}
