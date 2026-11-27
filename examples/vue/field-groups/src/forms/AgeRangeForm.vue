<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { LowerBoundField, UpperBoundField } from '../fieldGroups/fieldBounds'

const form = useForm({ defaultValues: { minAge: '', maxAge: '' } })
</script>

<template>
  <LowerBoundField
    label="Lowest Age"
    :form="form"
    :fields="{ value: 'minAge' }"
  />
  <UpperBoundField
    label="Highest Age"
    :form="form"
    :fields="{ value: 'maxAge', lowerBound: 'minAge' }"
  />
</template>
