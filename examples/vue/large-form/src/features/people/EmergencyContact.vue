<script setup lang="ts">
import { getFormType } from '../../compositions/form.ts'
import { peopleFormOpts } from './shared-form.ts'
import { computed } from 'vue'

const formType = getFormType({ ...peopleFormOpts })
const props = defineProps<{ form: typeof formType }>()
const form = computed(() => props.form)
</script>

<template>
  <form.AppField name="emergencyContact.fullName" v-slot="{ field }">
    <field.TextField label="Full Name" />
  </form.AppField>
  <form.AppField name="emergencyContact.phone" v-slot="{ field }">
    <field.TextField label="Phone" />
  </form.AppField>
</template>
