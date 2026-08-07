import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  TanStackFormGroup,
} from '@tanstack/angular-form'
import { step2Schema, stepValidator } from './shared-form'
import { TextFieldComponent } from './text-field.component'
import type { AngularFormType } from '@tanstack/angular-form'
import type { wizardFormOptions } from './shared-form'

@Component({
  selector: 'app-step-two',
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
      name="step2"
      [validators]="validators"
      [onSubmit]="onSubmit"
      #group="formGroup"
    >
      <form (submit)="submit($event, group.api)">
        <h2>Step 2</h2>
        <app-text-field
          label="Step 2 Name"
          tanstack-app-field
          [tanstackField]="form()"
          [name]="group.fieldName('name')"
        />
        <div class="actions">
          <button type="button" (click)="back()()">Back</button>
          <button type="submit" [disabled]="group.api.state.isSubmitting">
            Submit
          </button>
        </div>
      </form>
    </ng-container>
  `,
})
export class StepTwoComponent {
  form = input.required<AngularFormType<typeof wizardFormOptions>>()
  back = input.required<() => void>()
  validators = [stepValidator(step2Schema)]
  onSubmit = () => {
    void this.form().handleSubmit()
  }

  submit(event: SubmitEvent, group: { handleSubmit: () => unknown }) {
    event.preventDefault()
    event.stopPropagation()
    group.handleSubmit()
  }
}
