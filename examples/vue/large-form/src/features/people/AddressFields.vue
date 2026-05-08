<script setup lang="ts">
import { getFormType } from '../../compositions/form.ts'
import { peopleFormOpts } from './shared-form.ts'
import { computed } from 'vue'

const formType = getFormType({ ...peopleFormOpts })
const props = defineProps<{ form: typeof formType }>()
const form = computed(() => props.form)
</script>

<template>
  <div>
    <h2>Address</h2>
    <form.AppField name="address.line1" v-slot="{ field }">
      <field.TextField label="Address Line 1" />
    </form.AppField>
    <form.AppField name="address.line2" v-slot="{ field }">
      <field.TextField label="Address Line 2" />
    </form.AppField>
    <form.AppField name="address.city" v-slot="{ field }">
      <field.TextField label="City" />
    </form.AppField>
    <form.AppField name="address.state" v-slot="{ field }">
      <field.TextField label="State" />
    </form.AppField>
    <form.AppField name="address.zip" v-slot="{ field }">
      <field.TextField label="ZIP Code" />
    </form.AppField>
  </div>
</template>
