<template>
  <slot v-bind="fieldApi" />
</template>

<script setup lang="ts" generic="TData, TFormData">
import { useField, UseFieldOptions } from './useField'
import { provideFormContext } from './formContext'

const fieldOptions = defineProps<UseFieldOptions<TData, TFormData>>()

const fieldApi = useField(fieldOptions)

provideFormContext({
  formApi: fieldApi.form,
  parentFieldName: fieldApi.name,
})
</script>
