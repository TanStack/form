<script setup lang="ts">
import type { emergencyContactFields } from './emergency-contact.ts'

const { fields } = defineProps<{
  fields: typeof emergencyContactFields
}>()
</script>

<template>
  <fields.Field name="fullName" v-slot="{ field }">
    <field.TextField label="Full Name" />
  </fields.Field>
  <fields.Field name="phone" v-slot="{ field }">
    <field.TextField label="Phone" />
  </fields.Field>
</template>
