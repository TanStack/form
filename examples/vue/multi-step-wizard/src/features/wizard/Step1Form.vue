<script setup lang="ts">
import { computed } from 'vue'
import { step1Schema, stepValidator } from './shared-form.ts'
import type { VueFormType } from '@tanstack/vue-form'
import type { wizardFormOpts } from './shared-form.ts'

const props = defineProps<{
  form: VueFormType<typeof wizardFormOpts>
  step: number
  setStep: (step: number) => void
}>()

const form = computed(() => props.form)
</script>

<template>
  <form.FormGroup
    name="step1"
    :validators="[stepValidator(step1Schema)]"
    :on-submit="() => setStep(step + 1)"
    :on-submit-invalid="() => undefined"
    v-slot="{ group }"
  >
    <form @submit.prevent.stop="group.handleSubmit()">
      <group.Field name="name" v-slot="{ field }">
        <field.TextField label="Step 1 Name" />
      </group.Field>

      <form.SubscribeButton label="Next" />
    </form>
  </form.FormGroup>
</template>
