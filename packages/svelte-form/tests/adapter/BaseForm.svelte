<svelte:options runes />

<script lang="ts">
  import { createForm } from '../../src/index.js'

  const form = createForm(() => ({
    defaultValues: {
      name: 'Tony',
      visible: false,
      items: ['one'],
      guest: { name: 'Guest' },
    },
  }))
</script>

<form.Field
  name="name"
  validators={[
    {
      triggers: ['change'],
      run: ({ value }) =>
        value.length < 3 ? { message: 'Name is too short' } : undefined,
    },
  ]}
>
  {#snippet children(field)}
    <label>
      Name
      <input
        value={field.value}
        oninput={(event) => field.handleChange(event.currentTarget.value)}
      />
    </label>
    <span data-testid="name-value">{field.value}</span>
    {#each field.errors as error}
      <span role="alert">{error.message}</span>
    {/each}
  {/snippet}
</form.Field>

<form.ArrayField name="items">
  {#snippet children(field)}
    <span data-testid="items">{field.value.join(',')}</span>
  {/snippet}
</form.ArrayField>

<button
  type="button"
  onclick={() => form.pushFieldValue('items', 'two')}
>
  Push
</button>

<button type="button" onclick={() => form.reset({
  name: 'Rodney',
  visible: false,
  items: ['reset'],
  guest: { name: 'Reset Guest' },
})}>
  Reset
</button>

<button type="button" onclick={() => form.setFieldValue('visible', true)}>
  Show
</button>

<form.Subscribe
  selector={(state) => state.values.visible}
  when={(visible) => visible}
>
  {#snippet children()}
    <span data-testid="visible">Visible</span>
  {/snippet}
</form.Subscribe>

<form.FormGroup name="guest">
  {#snippet children(group)}
    <group.Field name="name">
      {#snippet children(field)}
        <label>
          Guest
          <input
            value={field.value}
            oninput={(event) => field.handleChange(event.currentTarget.value)}
          />
        </label>
      {/snippet}
    </group.Field>
    <span data-testid="group-value">{group.state.values.name}</span>
  {/snippet}
</form.FormGroup>
