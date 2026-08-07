<script setup lang="ts">
import { useAppForm } from '../../compositions/form.ts'
import AddressFields from './AddressFields.vue'
import FieldGroupEmergencyContact from './EmergencyContact.vue'
import { peopleFormOpts } from './shared-form.ts'

const form = useAppForm({
  ...peopleFormOpts,
  onSubmit: ({ value }) => {
    alert(JSON.stringify(value, null, 2))
  },
})
</script>

<template>
  <form @submit.prevent.stop="form.handleSubmit()">
    <h1>Personal Information</h1>
    <form.AppField name="fullName" v-slot="{ field }">
      <field.TextField label="Full Name" />
    </form.AppField>
    <form.AppField name="email" v-slot="{ field }">
      <field.TextField label="Email" />
    </form.AppField>
    <form.AppField name="phone" v-slot="{ field }">
      <field.TextField label="Phone" />
    </form.AppField>
    <AddressFields :form="form" />
    <h2>Emergency Contact</h2>
    <FieldGroupEmergencyContact :form="form" />

    <form.AppForm>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  </form>
</template>
