<script lang="ts">
  import { useAppForm } from '../../hooks/form.js'
  import { wizardFormOpts } from './shared-form.js'
  import Step1Form from './Step1Form.svelte'
  import Step2Form from './Step2Form.svelte'

  let step = $state(0)
  const setStep = (next: number) => {
    step = next
  }
  const form = useAppForm(() => ({
    ...wizardFormOpts,
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  }))
</script>

<form.AppForm>
  {#if step === 0}
    <Step1Form {form} {step} {setStep} />
  {:else}
    <Step2Form {form} {step} {setStep} />
  {/if}
</form.AppForm>
