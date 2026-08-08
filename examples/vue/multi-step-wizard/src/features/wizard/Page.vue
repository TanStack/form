<script setup lang="ts">
import { ref } from 'vue'
import { useAppForm } from '../../hooks/form.ts'
import Step1Form from './Step1Form.vue'
import Step2Form from './Step2Form.vue'
import { wizardFormOpts } from './shared-form.ts'

const step = ref(0)
const form = useAppForm({
  ...wizardFormOpts,
  onSubmit: ({ value }) => {
    alert(`Form submitted: ${JSON.stringify(value)}`)
  },
})

function setStep(nextStep: number) {
  step.value = nextStep
}
</script>

<template>
  <form.AppForm>
    <Step1Form
      v-if="step === 0"
      :form="form"
      :step="step"
      :set-step="setStep"
    />
    <Step2Form v-else :form="form" :step="step" :set-step="setStep" />
  </form.AppForm>
</template>
