<svelte:options runes />

<script lang="ts">
  import { createForm } from '../../src/index.js'
  import ArrayObserver from './ArrayObserver.svelte'

  interface Props {
    watchedListener: () => void
    mountListener: () => void
    unmountListener: () => void
  }

  const { watchedListener, mountListener, unmountListener }: Props = $props()
  let optionVersion = $state(0)
  const form = createForm(() => ({
    defaultValues: {
      guest: { name: '', confirmation: '' },
      people: [{ name: 'Tony' }],
    },
  }))
</script>

<form.FormGroup name="guest">
  {#snippet children(group)}
    <group.Field name="name">
      {#snippet children(field)}
        <button type="button" onclick={() => field.handleChange('Updated')}>
          Change watched field
        </button>
      {/snippet}
    </group.Field>
    <group.Field
      name="confirmation"
      listeners={[
        {
          triggers: ['change'],
          watchFields: ['name'],
          run: watchedListener,
        },
      ]}
    >
      {#snippet children()}{/snippet}
    </group.Field>
  {/snippet}
</form.FormGroup>

<span data-testid="option-version">{optionVersion}</span>
<button type="button" onclick={() => optionVersion++}>Update options</button>
<form.Field
  name="guest.name"
  listeners={[
    {
      triggers: ['mount'],
      triggerDebounceMs: optionVersion,
      run: mountListener,
    },
    { triggers: ['unmount'], run: unmountListener },
  ]}
>
  {#snippet children()}{/snippet}
</form.Field>

<form.ArrayField name="people">
  {#snippet children(field)}
    <ArrayObserver {field} />
  {/snippet}
</form.ArrayField>
<form.Field name="people[0].name">
  {#snippet children(field)}
    <button type="button" onclick={() => field.handleChange('Rodney')}>
      Change array child
    </button>
  {/snippet}
</form.Field>
<button
  type="button"
  onclick={() => form.pushFieldValue('people', { name: 'Daewon' })}
>
  Push array item
</button>
