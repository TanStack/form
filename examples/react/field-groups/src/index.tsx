import { useForm } from '@tanstack/react-form'
import ReactDOM from 'react-dom/client'
import './index.css'
import { DateRangeField } from './fieldGroups/dateRange'
import { LowerBoundField, UpperBoundField } from './fieldGroups/fieldBounds'

// The bounds field groups package validation and blur normalization once, then
// each form binds the group's virtual names to its own real field paths.
function PricingFilterForm() {
  const form = useForm({
    defaultValues: {
      minPrice: '',
      maxPrice: '',
    },
  })

  return (
    <>
      <LowerBoundField
        label="Lowest Price"
        form={form}
        fields={{
          // The group calls this field `value`; this form stores it at `minPrice`.
          value: 'minPrice',
        }}
      />
      <UpperBoundField
        label="Highest Price"
        form={form}
        fields={{
          // `value` is rendered, and `lowerBound` is only read by the validator.
          value: 'maxPrice',
          lowerBound: 'minPrice',
        }}
      />
    </>
  )
}

function AgeRangeForm() {
  const form = useForm({
    defaultValues: {
      minAge: '',
      maxAge: '',
    },
  })

  return (
    <>
      <LowerBoundField
        label="Lowest Age"
        form={form}
        fields={{
          // Same field group, different form paths.
          value: 'minAge',
        }}
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

// DateRangeField has access to both dates, but it still knows nothing about the
// array it is rendered from. The parent form supplies those concrete paths here.
function SwappableDateRangesForm() {
  const form = useForm({
    defaultValues: {
      dateRanges: [
        {
          id: 'A',
          start: '2026-07-01',
          end: '2026-07-05',
        },
        {
          id: 'B',
          start: '2026-08-10',
          end: '2026-08-15',
        },
      ],
    },
  })

  return (
    <>
      <button
        type="button"
        onClick={() => form.swapFieldValues('dateRanges', 0, 1)}
      >
        Swap date ranges
      </button>
      <form.ArrayField name="dateRanges">
        {(array) =>
          array.value.map((range, i) => (
            <DateRangeField
              key={range.id}
              label={`Range ${range.id}`}
              form={form}
              fields={{
                start: `dateRanges[${i}].start`,
                end: `dateRanges[${i}].end`,
              }}
            />
          ))
        }
      </form.ArrayField>
    </>
  )
}

function App() {
  return (
    <div>
      <h1>Field Group example</h1>

      <div>
        <h2>Price Filter Form</h2>
        <PricingFilterForm />
      </div>
      <div>
        <h2>Age Range Form</h2>
        <AgeRangeForm />
      </div>
      <div>
        <h2>Swappable Date Ranges Form</h2>
        <SwappableDateRangesForm />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
