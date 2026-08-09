import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackField,
  injectForm,
  injectSelector,
} from '@tanstack/angular-form'
import { type } from 'arktype'
import { Schema as S } from 'effect'
import * as v from 'valibot'
import { z } from 'zod'

const ZodSchema = z.object({
  firstName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3')
    .startsWith('A', "[Zod] First name must start with 'A'"),
  lastName: z.string().min(3, '[Zod] You must have a length of at least 3'),
})
const ValibotSchema = v.object({
  firstName: v.pipe(v.string(), v.minLength(3), v.startsWith('A')),
  lastName: v.pipe(v.string(), v.minLength(3)),
})
const ArkTypeSchema = type({
  firstName: 'string >= 3',
  lastName: 'string >= 3',
})
const EffectSchema = S.standardSchemaV1(
  S.Struct({
    firstName: S.String.pipe(S.minLength(3)),
    lastName: S.String.pipe(S.minLength(3)),
  }),
)

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    <main>
      <h1>Standard Schema Form Example</h1>
      <p>Swap the schema assigned to the validator in the component source.</p>
      <form (submit)="handleSubmit($event)">
        <ng-container
          [tanstackField]="form"
          name="firstName"
          #firstName="field"
        >
          <label>
            <span>First Name</span>
            <input
              [name]="firstName.api.name"
              [value]="firstName.api.value"
              (blur)="firstName.api.handleBlur()"
              (input)="firstName.api.handleChange($any($event).target.value)"
              [attr.aria-invalid]="firstName.api.meta.isInvalid"
            />
            @for (error of firstName.api.errors; track error) {
              <small role="alert">{{ error.message }}</small>
            }
          </label>
        </ng-container>
        <ng-container [tanstackField]="form" name="lastName" #lastName="field">
          <label>
            <span>Last Name</span>
            <input
              [name]="lastName.api.name"
              [value]="lastName.api.value"
              (blur)="lastName.api.handleBlur()"
              (input)="lastName.api.handleChange($any($event).target.value)"
              [attr.aria-invalid]="lastName.api.meta.isInvalid"
            />
            @for (error of lastName.api.errors; track error) {
              <small role="alert">{{ error.message }}</small>
            }
          </label>
        </ng-container>
        <button type="submit" [disabled]="!canSubmit()">
          {{ isSubmitting() ? '...' : 'Submit' }}
        </button>
      </form>
    </main>
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: { firstName: '', lastName: '' },
    validators: [{ run: ZodSchema, triggers: ['change'] }],
    onSubmit: async ({ value }) => console.log(value),
  })
  canSubmit = injectSelector(this.form, (state) => state.canSubmit)
  isSubmitting = injectSelector(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }

  // Keep the alternative Standard Schema implementations type-checked.
  alternativeSchemas = [ValibotSchema, ArkTypeSchema, EffectSchema]
}
