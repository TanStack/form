import { Component, input, output } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  TanStackFormGroup,
  injectWithForm,
} from '@tanstack/angular-form'
import { TextFieldComponent } from './text-field.component'
import { step1Schema, wizardFormOpts } from './shared-form'

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [
    TanStackField,
    TanStackAppField,
    TanStackFormGroup,
    TextFieldComponent,
  ],
  template: `
    <ng-container
      [tanstackFormGroup]="withForm.form"
      name="step1"
      [validators]="{ onDynamic: step1Schema }"
      [onGroupSubmit]="onGroupSubmit"
      [onGroupSubmitInvalid]="onGroupSubmitInvalid"
      #group="formGroup"
    >
      <form
        (submit)="
          $event.preventDefault();
          $event.stopPropagation();
          group.api.handleSubmit()
        "
      >
        <app-text-field
          label="Step 1 Name"
          tanstack-app-field
          [tanstackField]="withForm.form"
          name="step1.name"
        />

        <button type="submit" [disabled]="isSubmitting()">Submit</button>

        <!-- formGroup contains errorMaps and errors, just like forms and fields -->
        <pre>{{ stringify(group.api.state.meta.errorMap) }}</pre>
      </form>
    </ng-container>
  `,
})
export class Step1Component {
  withForm = injectWithForm({ ...wizardFormOpts })
  step = input.required<number>()
  isSubmitting = input.required<boolean>()
  stepChange = output<number>()

  step1Schema = step1Schema
  stringify = (value: unknown) => JSON.stringify(value, null, 2)

  onGroupSubmit = () => {
    this.stepChange.emit(this.step() + 1)
  }

  onGroupSubmitInvalid = () => {
    // Just like a form, you can also handle invalid submits at the group level,
    // which is useful for multi-step wizards to prevent going to the next step
    // if the current step is invalid
  }
}
