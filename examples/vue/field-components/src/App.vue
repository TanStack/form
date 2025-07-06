<script setup lang="ts">
import { formOptions } from '@tanstack/vue-form'
import { useAppForm } from './compositions/form'

const peopleFormOpts = formOptions({
  defaultValues: {
    fullName: '',
    email: '',
    phone: '',
    emergencyContact: {
      fullName: '',
      phone: '',
    },
  },
})

const form = useAppForm({
  ...peopleFormOpts,
  validators: {
    onChange: ({ value }) => {
      const errors = {
        fields: {},
      } as {
        fields: Record<string, string>
      }
      if (!value.fullName) {
        errors.fields.fullName = 'Full name is required'
      }
      if (!value.phone) {
        errors.fields.phone = 'Phone is required'
      }
      if (!value.emergencyContact.fullName) {
        errors.fields['emergencyContact.fullName'] =
          'Emergency contact full name is required'
      }
      if (!value.emergencyContact.phone) {
        errors.fields['emergencyContact.phone'] =
          'Emergency contact phone is required'
      }

      return errors
    },
  },
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
      {{ JSON.stringify(field.TextField, null, 2) }}
      <field.TextField label="Phone" />
    </form.AppField>
    <h2>Emergency Contact</h2>
    <form.AppField name="emergencyContact.fullName" v-slot="{ field }">
      <field.TextField label="Full Name" />
    </form.AppField>
    <form.AppField name="emergencyContact.phone" v-slot="{ field }">
      <field.TextField label="Phone" />
    </form.AppField>
    <form.AppForm>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  </form>
</template>
