import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  injectForm,
  injectSelector,
} from '@tanstack/angular-form'
import { FormSectionComponent } from './form-section.component'
import { StringFieldComponent } from './string-field.component'
import { SubmitButtonComponent } from './submit-button.component'
import { sharedFormOptions } from './shared-form'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TanStackAppField,
    TanStackField,
    FormSectionComponent,
    StringFieldComponent,
    SubmitButtonComponent,
  ],
  template: `
    <main>
      <h1>Split Form Example</h1>
      <form (submit)="handleSubmit($event)">
        <app-string-field
          label="First Name"
          tanstack-app-field
          [tanstackField]="form"
          name="firstName"
        />
        <app-string-field
          label="Last Name"
          tanstack-app-field
          [tanstackField]="form"
          name="lastName"
        />
        <app-form-section [form]="form" />
        <div class="actions">
          <app-submit-button
            [canSubmit]="canSubmit"
            [isSubmitting]="isSubmitting"
          />
          <button type="button" (click)="form.reset()">Reset</button>
        </div>
      </form>
    </main>
  `,
})
export class AppComponent {
  form = injectForm({
    ...sharedFormOptions,
    onSubmit: ({ value }) => console.log(value),
  })
  canSubmit = injectSelector(this.form, (state) => state.canSubmit)
  isSubmitting = injectSelector(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
