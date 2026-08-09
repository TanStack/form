import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { TanStackAppField, TanStackField } from '@tanstack/angular-form'
import { TextFieldComponent } from './text-field.component'
import type { AngularFormType } from '@tanstack/angular-form'
import type { peopleFormOptions } from './shared-form'

@Component({
  selector: 'app-address-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackAppField, TanStackField, TextFieldComponent],
  template: `
    <section>
      <h2>Address</h2>
      @for (field of addressFields; track field.name) {
        <app-text-field
          [label]="field.label"
          tanstack-app-field
          [tanstackField]="form()"
          [name]="field.name"
        />
      }
    </section>
  `,
})
export class AddressFieldsComponent {
  form = input.required<AngularFormType<typeof peopleFormOptions>>()
  addressFields = [
    { name: 'address.line1' as const, label: 'Address Line 1' },
    { name: 'address.line2' as const, label: 'Address Line 2' },
    { name: 'address.city' as const, label: 'City' },
    { name: 'address.state' as const, label: 'State' },
    { name: 'address.zip' as const, label: 'ZIP Code' },
  ]
}
