import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { TanStackAppField, TanStackField } from '@tanstack/angular-form'
import { StringFieldComponent } from './string-field.component'
import type { AngularFormType } from '@tanstack/angular-form'
import type { sharedFormOptions } from './shared-form'

@Component({
  selector: 'app-form-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackAppField, TanStackField, StringFieldComponent],
  template: `
    <fieldset>
      <legend>Address</legend>
      <app-string-field
        label="Street"
        tanstack-app-field
        [tanstackField]="form()"
        name="address.street"
      />
      <app-string-field
        label="Country"
        tanstack-app-field
        [tanstackField]="form()"
        name="address.country"
      />
    </fieldset>
  `,
})
export class FormSectionComponent {
  form = input.required<AngularFormType<typeof sharedFormOptions>>()
}
