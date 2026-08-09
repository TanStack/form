import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  TanStackFormGroup,
} from '@tanstack/angular-form'
import { step1Schema, stepValidator } from './shared-form'
import { TextFieldComponent } from './text-field.component'
import type { AngularFormType } from '@tanstack/angular-form'
import type { wizardFormOptions } from './shared-form'

@Component({
  selector: 'app-step-one',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TanStackAppField,
    TanStackField,
    TanStackFormGroup,
    TextFieldComponent,
  ],
  template: `
    <ng-container
      [tanstackFormGroup]="form()"
      name="step1"
      [validators]="validators"
      [onSubmit]="onSubmit"
      #group="formGroup"
    >
      <form (submit)="submit($event, group.api)">
        <h2>Step 1</h2>
        <app-text-field
          label="Step 1 Name"
          tanstack-app-field
          [tanstackField]="group.api"
          name="name"
        />
        <button type="submit" [disabled]="group.api.state.isSubmitting">
          Next
        </button>
      </form>
    </ng-container>
  `,
})
export class StepOneComponent {
  form = input.required<AngularFormType<typeof wizardFormOptions>>()
  advance = input.required<() => void>()
  validators = [stepValidator(step1Schema)]
  onSubmit = () => this.advance()()

  submit(event: SubmitEvent, group: { handleSubmit: () => unknown }) {
    event.preventDefault()
    event.stopPropagation()
    group.handleSubmit()
  }
}
