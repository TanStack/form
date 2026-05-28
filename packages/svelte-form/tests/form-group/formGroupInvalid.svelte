<svelte:options runes />

<script lang="ts">
  import { createForm } from '../../src/index.js'

  let {
    onSubmit,
    onGroupSubmit,
    onGroupSubmitInvalid,
  }: {
    onSubmit: (...args: any[]) => void
    onGroupSubmit: (...args: any[]) => void
    onGroupSubmitInvalid: (...args: any[]) => void
  } = $props()

  const form = createForm(() => ({
    defaultValues: {
      step1: { name: '' },
      step2: { name: 'test2' },
    },
    onSubmit,
  }))
</script>

<form.FormGroup
  name="step1"
  validators={{
    onSubmit: ({ value }) => (!value.name ? 'Name is required' : undefined),
  }}
  {onGroupSubmit}
  {onGroupSubmitInvalid}
>
  {#snippet children(group)}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        group.handleSubmit()
      }}
    >
      <form.Field name="step1.name">
        {#snippet children(field)}
          <input
            data-testid="step1-name"
            value={field.state.value}
            oninput={(e: Event) =>
              field.handleChange((e.target as HTMLInputElement).value)}
          />
        {/snippet}
      </form.Field>
      <button type="submit" data-testid="submit-group">Submit Group</button>
      <pre data-testid="group-error"
        >{String(group.state.meta.errorMap.onSubmit ?? '')}</pre
      >
    </form>
  {/snippet}
</form.FormGroup>
