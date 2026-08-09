<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'

  const { items }: { items: Array<string> } = $props()
  const form = createForm(() => ({
    defaultValues: { items },
    onSubmit: ({ value }) => {
      console.log(value)
      alert(`Submitted ${value.items.length} items.`)
    },
  }))
</script>

<form.Subscribe selector={(state) => state.values.items.length}>
  {#snippet children(amount)}
    <h2>Item amount: {amount.toLocaleString()}</h2>
  {/snippet}
</form.Subscribe>
<form
  onsubmit={(event) => {
    event.preventDefault()
    event.stopPropagation()
    form.handleSubmit()
  }}
>
  <button type="submit">Submit</button>
  <button
    type="button"
    onclick={() => form.pushFieldValue('items', 'New Field')}
  >
    Create item
  </button>
  <form.ArrayField name="items">
    {#snippet children(array)}
      <ul>
        {#each array.value as _, index}
          <form.Field name={`items[${index}]`}>
            {#snippet children(field)}
              <li>
                <label>
                  <span>Field {index}</span>
                  <input
                    name={field.name}
                    value={field.value}
                    onblur={field.handleBlur}
                    oninput={(event) =>
                      field.handleChange(event.currentTarget.value)}
                  />
                </label>
              </li>
            {/snippet}
          </form.Field>
        {/each}
      </ul>
    {/snippet}
  </form.ArrayField>
</form>
