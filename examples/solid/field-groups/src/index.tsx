import { For } from 'solid-js'
import { render } from 'solid-js/web'
import { createForm } from '@tanstack/solid-form'
import { DateRangeField } from './fieldGroups/dateRange'
import { LowerBoundField, UpperBoundField } from './fieldGroups/fieldBounds'
import './index.css'

function PricingFilterForm() {
  const form = createForm(() => ({
    defaultValues: {
      minPrice: '',
      maxPrice: '',
    },
  }))

  return (
    <>
      <LowerBoundField
        label="Lowest Price"
        form={form}
        fields={{ value: 'minPrice' }}
      />
      <UpperBoundField
        label="Highest Price"
        form={form}
        fields={{
          value: 'maxPrice',
          lowerBound: 'minPrice',
        }}
      />
    </>
  )
}

function AgeRangeForm() {
  const form = createForm(() => ({
    defaultValues: {
      minAge: '',
      maxAge: '',
    },
  }))

  return (
    <>
      <LowerBoundField
        label="Lowest Age"
        form={form}
        fields={{ value: 'minAge' }}
      />
      <UpperBoundField
        label="Highest Age"
        form={form}
        fields={{
          value: 'maxAge',
          lowerBound: 'minAge',
        }}
      />
    </>
  )
}

function SwappableDateRangesForm() {
  const form = createForm(() => ({
    defaultValues: {
      dateRanges: [
        { id: 'A', start: '2026-07-01', end: '2026-07-05' },
        { id: 'B', start: '2026-08-10', end: '2026-08-15' },
      ],
    },
  }))

  return (
    <>
      <button
        type="button"
        onClick={() => form.swapFieldValues('dateRanges', 0, 1)}
      >
        Swap date ranges
      </button>
      <form.ArrayField name="dateRanges">
        {(array) => (
          <For each={array().value}>
            {(range, index) => (
              <DateRangeField
                label={`Range ${range.id}`}
                form={form}
                fields={{
                  start: `dateRanges[${index()}].start`,
                  end: `dateRanges[${index()}].end`,
                }}
              />
            )}
          </For>
        )}
      </form.ArrayField>
    </>
  )
}

function App() {
  return (
    <div>
      <h1>Field Group Example</h1>
      <section>
        <h2>Price Filter Form</h2>
        <PricingFilterForm />
      </section>
      <section>
        <h2>Age Range Form</h2>
        <AgeRangeForm />
      </section>
      <section>
        <h2>Swappable Date Ranges Form</h2>
        <SwappableDateRangesForm />
      </section>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
