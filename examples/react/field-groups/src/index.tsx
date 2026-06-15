import { useForm } from '@tanstack/react-form'
import ReactDOM from 'react-dom/client'
import './index.css'
import { LowerBoundField, UpperBoundField } from './fieldGroups/fieldBounds'

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
          name: 'minPrice',
        }}
      />
      <UpperBoundField
        label="Highest Price"
        form={form}
        fields={{
          name: 'maxPrice',
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
          name: 'minAge',
        }}
      />
      <UpperBoundField
        label="Highest Age"
        form={form}
        fields={{
          name: 'maxAge',
          lowerBound: 'minAge',
        }}
      />
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
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
