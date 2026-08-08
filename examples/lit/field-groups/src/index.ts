import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import { DateRangeField } from './date-range'
import { LowerBoundField, UpperBoundField } from './field-bounds'
import './styles.css'

@customElement('tanstack-field-groups')
export class TanStackFieldGroups extends LitElement {
  private pricingForm = new TanStackFormController(this, {
    defaultValues: { minPrice: '', maxPrice: '' },
  })

  private ageForm = new TanStackFormController(this, {
    defaultValues: { minAge: '', maxAge: '' },
  })

  private dateForm = new TanStackFormController(this, {
    defaultValues: {
      dateRanges: [
        { id: 'A', start: '2026-07-01', end: '2026-07-05' },
        { id: 'B', start: '2026-08-10', end: '2026-08-15' },
      ],
    },
  })

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      <h1>Reusable Field Group Example</h1>
      <section>
        <h2>Price Filter Form</h2>
        ${LowerBoundField({
          form: this.pricingForm,
          fields: { value: 'minPrice' },
          label: 'Lowest Price',
        })}
        ${UpperBoundField({
          form: this.pricingForm,
          fields: { value: 'maxPrice', lowerBound: 'minPrice' },
          label: 'Highest Price',
        })}
      </section>
      <section>
        <h2>Age Range Form</h2>
        ${LowerBoundField({
          form: this.ageForm,
          fields: { value: 'minAge' },
          label: 'Lowest Age',
        })}
        ${UpperBoundField({
          form: this.ageForm,
          fields: { value: 'maxAge', lowerBound: 'minAge' },
          label: 'Highest Age',
        })}
      </section>
      <section>
        <h2>Swappable Date Ranges</h2>
        <button
          type="button"
          @click=${() => this.dateForm.api.swapFieldValues('dateRanges', 0, 1)}
        >
          Swap date ranges
        </button>
        ${this.dateForm.arrayField({ name: 'dateRanges' }, (array) =>
          array.value.map((range, index) =>
            DateRangeField({
              form: this.dateForm,
              fields: {
                start: `dateRanges[${index}].start`,
                end: `dateRanges[${index}].end`,
              },
              label: `Range ${range.id}`,
            }),
          ),
        )}
      </section>
    `
  }
}
