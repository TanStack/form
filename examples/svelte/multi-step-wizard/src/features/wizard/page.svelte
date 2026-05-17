<script lang="ts">
  import { revalidateLogic } from '@tanstack/svelte-form'
  import { z } from 'zod'
  import { createAppForm } from '../../runes/form.js'
  import {
    step1Schema,
    step2Schema,
    wizardFormOpts,
  } from './shared-form.js'
  import Step1Form from './step1-subform.svelte'
  import Step2Form from './step2-subform.svelte'

  let step = $state(0)
  const setStep = (next: number) => {
    step = next
  }

  const form = createAppForm(() => ({
    ...wizardFormOpts,
    validationLogic: revalidateLogic(),
    validators: {
      // onDynamic is only used when `form.handleSubmit` is called itself.
      // When `form.FormGroup`'s `handleSubmit` is called, it will only validate the current step's schema.
      // This means that this schema will not be called when the user submits the form group, but instead when they submit the entire form.
      onDynamic: z.object({
        step1: step1Schema,
        step2: step2Schema,
      }),
    },
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  }))
</script>

{#if step === 0}
  <Step1Form {form} {step} {setStep} />
{:else if step === 1}
  <Step2Form {form} {step} {setStep} />
{/if}
