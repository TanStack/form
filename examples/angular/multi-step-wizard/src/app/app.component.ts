import { Component, signal } from '@angular/core'
import {
  TanStackWithForm,
  injectForm,
  injectStore,
  revalidateLogic,
} from '@tanstack/angular-form'
import { z } from 'zod'
import { Step1Component } from './step1.component'
import { Step2Component } from './step2.component'
import { step1Schema, step2Schema, wizardFormOpts } from './shared-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackWithForm, Step1Component, Step2Component],
  template: `
    @if (step() === 0) {
      <app-step1
        tanstack-with-form
        [form]="form"
        [step]="step()"
        [isSubmitting]="isSubmitting()"
        (stepChange)="step.set($event)"
      />
    }
    @if (step() === 1) {
      <app-step2
        tanstack-with-form
        [form]="form"
        [step]="step()"
        [isSubmitting]="isSubmitting()"
        (stepChange)="step.set($event)"
      />
    }
  `,
})
export class AppComponent {
  step = signal(0)

  form = injectForm({
    ...wizardFormOpts,
    validationLogic: revalidateLogic(),
    // onDynamic is only used when `form.handleSubmit` is called itself.
    // When the FormGroup's `handleSubmit` is called, it will only validate the
    // current step's schema. This means that this schema will not be called
    // when the user submits the form group, but instead when they submit the
    // entire form.
    validators: {
      onDynamic: z.object({
        step1: step1Schema,
        step2: step2Schema,
      }),
    },
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  })

  isSubmitting = injectStore(this.form, (state) => state.isSubmitting)
}
