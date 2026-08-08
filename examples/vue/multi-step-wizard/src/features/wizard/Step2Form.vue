<script setup lang="ts">
import { computed } from 'vue'
import { step2Schema, stepValidator } from './shared-form.ts'
import type { VueFormType } from '@tanstack/vue-form'
import type { wizardFormOpts } from './shared-form.ts'

const props = defineProps<{
  form: VueFormType<typeof wizardFormOpts>
  step: number
  setStep: (step: number) => void
}>()

const form = computed(() => props.form)

function submitForm() {
  void props.form.handleSubmit()
}
</script>

<template>
  <form.FormGroup
    name="step2"
    :validators="[stepValidator(step2Schema)]"
    :on-submit="submitForm"
    v-slot="{ group }"
  >
    <form @submit.prevent.stop="group.handleSubmit()">
      <group.Field name="name" v-slot="{ field }">
        <field.TextField label="Step 2 Name" />
      </group.Field>

      <button type="button" @click="setStep(step - 1)">Back</button>
      <form.SubscribeButton label="Submit" />
    </form>
  </form.FormGroup>
</template>
