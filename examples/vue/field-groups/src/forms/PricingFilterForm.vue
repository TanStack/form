<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { LowerBoundField, UpperBoundField } from '../fieldGroups/fieldBounds'

const form = useForm({ defaultValues: { minPrice: '', maxPrice: '' } })
</script>

<template>
  <LowerBoundField
    label="Lowest Price"
    :form="form"
    :fields="{ value: 'minPrice' }"
  />
  <UpperBoundField
    label="Highest Price"
    :form="form"
    :fields="{ value: 'maxPrice', lowerBound: 'minPrice' }"
  />
</template>
