<script setup lang="ts">
import { useAppForm } from '../../hooks/form.ts'
import AddressFields from './AddressFields.vue'
import { FieldGroupEmergencyContact } from './emergency-contact.ts'
import { peopleFormOpts } from './shared-form.ts'

const form = useAppForm({
  ...peopleFormOpts,
  onSubmit: ({ value }) => {
    alert(JSON.stringify(value, null, 2))
  },
})
</script>

<template>
  <form @submit.prevent="form.handleSubmit()">
    <h1>Personal Information</h1>

    <form.Field name="fullName" v-slot="{ field }">
      <field.TextField label="Full Name" />
    </form.Field>
    <form.Field name="email" v-slot="{ field }">
      <field.TextField label="Email" />
    </form.Field>
    <form.Field name="phone" v-slot="{ field }">
      <field.TextField label="Phone" />
    </form.Field>

    <AddressFields :form="form" />

    <section>
      <h2>Emergency Contact</h2>
      <FieldGroupEmergencyContact
        :form="form"
        :fields="{
          fullName: 'emergencyContact.fullName',
          phone: 'emergencyContact.phone',
        }"
      />
    </section>

    <form.AppForm>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  </form>
</template>
