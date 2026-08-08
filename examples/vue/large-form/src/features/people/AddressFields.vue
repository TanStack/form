<script setup lang="ts">
import { computed } from 'vue'
import type { VueFormType } from '@tanstack/vue-form'
import type { peopleFormOpts } from './shared-form.ts'

const props = defineProps<{
  form: VueFormType<typeof peopleFormOpts>
}>()

const form = computed(() => props.form)
</script>

<template>
  <section>
    <h2>Address</h2>
    <form.Field name="address.line1" v-slot="{ field }">
      <field.TextField label="Address Line 1" />
    </form.Field>
    <form.Field name="address.line2" v-slot="{ field }">
      <field.TextField label="Address Line 2" />
    </form.Field>
    <form.Field name="address.city" v-slot="{ field }">
      <field.TextField label="City" />
    </form.Field>
    <form.Field name="address.state" v-slot="{ field }">
      <field.TextField label="State" />
    </form.Field>
    <form.Field name="address.zip" v-slot="{ field }">
      <field.TextField label="ZIP Code" />
    </form.Field>
  </section>
</template>
