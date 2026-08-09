import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TanStackArrayField, injectForm } from '@tanstack/angular-form'
import { BoundFieldComponent } from './bound-field.component'
import { DateRangeComponent } from './date-range.component'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoundFieldComponent, DateRangeComponent, TanStackArrayField],
  template: `
    <main>
      <h1>Reusable Field Group Example</h1>
      <section>
        <h2>Price Filter Form</h2>
        <app-bound-field
          label="Lowest Price"
          [form]="pricingForm"
          [fields]="{ value: 'minPrice' }"
        />
        <app-bound-field
          label="Highest Price"
          [form]="pricingForm"
          [fields]="{ value: 'maxPrice', lowerBound: 'minPrice' }"
        />
      </section>
      <section>
        <h2>Age Range Form</h2>
        <app-bound-field
          label="Lowest Age"
          [form]="ageForm"
          [fields]="{ value: 'minAge' }"
        />
        <app-bound-field
          label="Highest Age"
          [form]="ageForm"
          [fields]="{ value: 'maxAge', lowerBound: 'minAge' }"
        />
      </section>
      <section>
        <h2>Swappable Date Ranges</h2>
        <button
          type="button"
          (click)="dateForm.swapFieldValues('dateRanges', 0, 1)"
        >
          Swap date ranges
        </button>
        <ng-container
          [tanstackArrayField]="dateForm"
          name="dateRanges"
          #ranges="arrayField"
        >
          @for (range of ranges.api.value; track range.id; let index = $index) {
            <app-date-range
              [label]="'Range ' + range.id"
              [form]="dateForm"
              [fields]="dateFields(index)"
            />
          }
        </ng-container>
      </section>
    </main>
  `,
})
export class AppComponent {
  pricingForm = injectForm({ defaultValues: { minPrice: '', maxPrice: '' } })
  ageForm = injectForm({ defaultValues: { minAge: '', maxAge: '' } })
  dateForm = injectForm({
    defaultValues: {
      dateRanges: [
        { id: 'A', start: '2026-07-01', end: '2026-07-05' },
        { id: 'B', start: '2026-08-10', end: '2026-08-15' },
      ],
    },
  })

  dateFields(index: number) {
    return {
      start: `dateRanges[${index}].start`,
      end: `dateRanges[${index}].end`,
    }
  }
}
