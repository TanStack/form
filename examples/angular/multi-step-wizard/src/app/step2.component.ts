import { Component, input, output } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  TanStackFormGroup,
  injectWithForm,
} from '@tanstack/angular-form'
import { TextFieldComponent } from './text-field.component'
import { step2Schema, wizardFormOpts } from './shared-form'

@Component({
  selector: 'app-step2',
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
      name="step2"
      [validators]="{ onDynamic: step2Schema }"
      [onGroupSubmit]="onGroupSubmit"
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
          label="Step 2 Name"
          tanstack-app-field
          [tanstackField]="withForm.form"
          name="step2.name"
        />

        <button type="button" (click)="stepChange.emit(step() - 1)">
          Back
        </button>
        <button type="submit" [disabled]="isSubmitting()">Submit</button>
      </form>
    </ng-container>
  `,
})
export class Step2Component {
  withForm = injectWithForm({ ...wizardFormOpts })
  step = input.required<number>()
  isSubmitting = input.required<boolean>()
  stepChange = output<number>()

  step2Schema = step2Schema

  onGroupSubmit = () => {
    this.withForm.form.handleSubmit()
  }
}
