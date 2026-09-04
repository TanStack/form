import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  injectWithForm,
} from '@tanstack/angular-form'
import { TextField } from '../../components/text-field.component'
import { peopleFormOpts } from './shared-form'

@Component({
  selector: 'app-address-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField, TanStackAppField, TextField],
  template: `
    <div>
      <h2>Address</h2>
      <app-text-field
        label="Address Line 1"
        tanstack-app-field
        [tanstackField]="withForm.form"
        name="address.line1"
      />
      <app-text-field
        label="Address Line 2"
        tanstack-app-field
        [tanstackField]="withForm.form"
        name="address.line2"
      />
      <app-text-field
        label="City"
        tanstack-app-field
        [tanstackField]="withForm.form"
        name="address.city"
      />
      <app-text-field
        label="State"
        tanstack-app-field
        [tanstackField]="withForm.form"
        name="address.state"
      />
      <app-text-field
        label="ZIP Code"
        tanstack-app-field
        [tanstackField]="withForm.form"
        name="address.zip"
      />
    </div>
  `,
})
export class AddressFields {
  withForm = injectWithForm({ ...peopleFormOpts })
}
