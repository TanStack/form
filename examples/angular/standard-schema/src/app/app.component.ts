import { Component } from '@angular/core'
import { TanStackField, injectForm, injectStore } from '@tanstack/angular-form'
import * as v from 'valibot'
import { z } from 'zod'
import { Schema as S } from 'effect'

const ZodSchema = z.object({
  firstName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3')
    .startsWith('A', "[Zod] First name must start with 'A'"),
  lastName: z.string().min(3, '[Zod] You must have a length of at least 3'),
})

const ValibotSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.minLength(3, '[Valibot] You must have a length of at least 3'),
    v.startsWith('A', "[Valibot] First name must start with 'A'"),
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(3, '[Valibot] You must have a length of at least 3'),
  ),
})

const EffectSchema = S.standardSchemaV1(
  S.Struct({
    firstName: S.String.pipe(
      S.minLength(3),
      S.annotations({
        message: () => '[Effect/Schema] You must have a length of at least 3',
      }),
    ),
    lastName: S.String.pipe(
      S.minLength(3),
      S.annotations({
        message: () => '[Effect/Schema] You must have a length of at least 3',
      }),
    ),
  }),
)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <form (submit)="handleSubmit($event)">
      <div>
        <ng-container
          [tanstackField]="form"
          name="firstName"
          #firstName="field"
        >
          <label [for]="firstName.api.name">First Name:</label>
          <input
            [id]="firstName.api.name"
            [name]="firstName.api.name"
            [value]="firstName.api.state.value"
            (blur)="firstName.api.handleBlur()"
            (input)="firstName.api.handleChange($any($event).target.value)"
          />
          @if (firstName.api.state.meta.isTouched) {
            @for (error of firstName.api.state.meta.errors; track $index) {
              <div style="color: red">
                {{ error.message }}
              </div>
            }
          }
          @if (firstName.api.state.meta.isValidating) {
            <p>Validating...</p>
          }
        </ng-container>
      </div>
      <div>
        <ng-container [tanstackField]="form" name="lastName" #lastName="field">
          <label [for]="lastName.api.name">Last Name:</label>
          <input
            [id]="lastName.api.name"
            [name]="lastName.api.name"
            [value]="lastName.api.state.value"
            (blur)="lastName.api.handleBlur()"
            (input)="lastName.api.handleChange($any($event).target.value)"
          />
          @if (firstName.api.state.meta.isTouched) {
            @for (error of firstName.api.state.meta.errors; track $index) {
              <div style="color: red">
                {{ error.message }}
              </div>
            }
          }
          @if (firstName.api.state.meta.isValidating) {
            <p>Validating...</p>
          }
        </ng-container>
      </div>
      <button type="submit" [disabled]="!canSubmit()">
        {{ isSubmitting() ? '...' : 'Submit' }}
      </button>
      <button type="reset" (click)="form.reset()">Reset</button>
    </form>
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },

    validators: {
      // DEMO: You can switch between schemas seamlessly
      onChange: ZodSchema,
      // onChange: ValibotSchema,
      // onChange: EffectSchema,
    },
    onSubmit({ value }) {
      // Do something with form data
      console.log(value)
    },
  })

  canSubmit = injectStore(this.form, (state) => state.canSubmit)
  isSubmitting = injectStore(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
