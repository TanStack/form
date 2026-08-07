import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { TanStackField } from '@tanstack/angular-form'
import type { AnyAngularFormApi } from '@tanstack/angular-form'

@Component({
  selector: 'app-date-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    <fieldset>
      <legend>{{ label() }}</legend>
      <ng-container
        [tanstackField]="form()"
        [name]="fields().start"
        #start="field"
      >
        <label>
          <span>Start date</span>
          <input
            type="date"
            [name]="start.api.name"
            [value]="start.api.value"
            (blur)="start.api.handleBlur()"
            (input)="start.api.handleChange($any($event).target.value)"
          />
        </label>
      </ng-container>
      <ng-container
        [tanstackField]="form()"
        [name]="fields().end"
        [validators]="endValidators()"
        #end="field"
      >
        <label>
          <span>End date</span>
          <input
            type="date"
            [name]="end.api.name"
            [value]="end.api.value"
            (blur)="end.api.handleBlur()"
            (input)="end.api.handleChange($any($event).target.value)"
            [attr.aria-invalid]="end.api.meta.isInvalid"
          />
          @for (error of end.api.errors; track error) {
            <small role="alert">{{ error.message }}</small>
          }
        </label>
      </ng-container>
    </fieldset>
  `,
})
export class DateRangeComponent {
  form = input.required<AnyAngularFormApi>()
  label = input.required<string>()
  fields = input.required<{ start: string; end: string }>()
  endValidators = computed(() => [
    {
      triggers: ['change'] as const,
      watchFields: [this.fields().start],
      run: ({ value }: { value: string }) => {
        const start = this.form().getFieldValue(this.fields().start)
        return value && start && value < start
          ? 'End date must be after the start date'
          : undefined
      },
    },
  ])
}
