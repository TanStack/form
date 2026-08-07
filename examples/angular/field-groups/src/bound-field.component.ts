import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { TanStackField } from '@tanstack/angular-form'
import { z } from 'zod'
import type { AnyAngularFormApi } from '@tanstack/angular-form'

const boundsSchema = z.coerce.number<string>().int()

@Component({
  selector: 'app-bound-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    <ng-container
      [tanstackField]="form()"
      [name]="fields().value"
      [validators]="validators()"
      #field="field"
    >
      <label>
        <span>{{ label() }}</span>
        <input
          inputmode="numeric"
          [name]="field.api.name"
          [value]="field.api.value"
          (blur)="field.api.handleBlur()"
          (input)="field.api.handleChange($any($event).target.value)"
          [attr.aria-invalid]="field.api.meta.isInvalid"
        />
        @for (error of field.api.errors; track error) {
          <small role="alert">{{ error.message }}</small>
        }
      </label>
    </ng-container>
  `,
})
export class BoundFieldComponent {
  form = input.required<AnyAngularFormApi>()
  label = input.required<string>()
  fields = input.required<{ value: string; lowerBound?: string }>()

  validators = computed(() => [
    {
      triggers: ['change'] as const,
      watchFields: this.fields().lowerBound
        ? [this.fields().lowerBound!]
        : undefined,
      run: ({ value, parseIssues }: any) => {
        const valueResult = boundsSchema.safeParse(value)
        if (!valueResult.success) return parseIssues(valueResult.error.issues)
        const lowerName = this.fields().lowerBound
        if (!lowerName) return
        const lowerResult = boundsSchema.safeParse(
          this.form().getFieldValue(lowerName),
        )
        if (lowerResult.success && valueResult.data < lowerResult.data) {
          return 'Upper bound must be greater than lower bound'
        }
      },
    },
  ])
}
