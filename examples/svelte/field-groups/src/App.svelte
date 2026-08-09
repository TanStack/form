<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import { DateRangeField } from './fieldGroups/dateRange.js'
  import {
    LowerBoundField,
    UpperBoundField,
  } from './fieldGroups/fieldBounds.js'
  import './index.css'

  const pricingForm = createForm(() => ({
    defaultValues: { minPrice: '', maxPrice: '' },
  }))
  const ageForm = createForm(() => ({
    defaultValues: { minAge: '', maxAge: '' },
  }))
  const dateForm = createForm(() => ({
    defaultValues: {
      dateRanges: [
        { id: 'A', start: '2026-07-01', end: '2026-07-05' },
        { id: 'B', start: '2026-08-10', end: '2026-08-15' },
      ],
    },
  }))
</script>

<div>
  <h1>Field Group Example</h1>
  <section>
    <h2>Price Filter Form</h2>
    <LowerBoundField
      label="Lowest Price"
      form={pricingForm}
      fields={{ value: 'minPrice' }}
    />
    <UpperBoundField
      label="Highest Price"
      form={pricingForm}
      fields={{ value: 'maxPrice', lowerBound: 'minPrice' }}
    />
  </section>
  <section>
    <h2>Age Range Form</h2>
    <LowerBoundField
      label="Lowest Age"
      form={ageForm}
      fields={{ value: 'minAge' }}
    />
    <UpperBoundField
      label="Highest Age"
      form={ageForm}
      fields={{ value: 'maxAge', lowerBound: 'minAge' }}
    />
  </section>
  <section>
    <h2>Swappable Date Ranges Form</h2>
    <button
      type="button"
      onclick={() => dateForm.swapFieldValues('dateRanges', 0, 1)}
    >
      Swap date ranges
    </button>
    <dateForm.ArrayField name="dateRanges">
      {#snippet children(array)}
        {#each array.value as range, index (range.id)}
          <DateRangeField
            label={`Range ${range.id}`}
            form={dateForm}
            fields={{
              start: `dateRanges[${index}].start`,
              end: `dateRanges[${index}].end`,
            }}
          />
        {/each}
      {/snippet}
    </dateForm.ArrayField>
  </section>
</div>
