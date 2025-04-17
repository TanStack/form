<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'

  const form = createForm(() => ({
    defaultValues: {
      people: [] as Array<{ age: number; name: string }>,
    },
    onSubmit: ({ value }) => alert(JSON.stringify(value)),
  }))
</script>

<form
  id="form"
  onsubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }}
>
  <h1>TanStack Form - Svelte Demo</h1>

  <form.Field name="people">
    {#snippet children(field)}
      <div>
        {#each field.state.value as person, i}
          <form.Field name={`people[${i}].name`}>
            {#snippet children(subField)}
              <div>
                <label>
                  <div>Name for person {i}</div>
                  <input
                    value={person.name}
                    oninput={(e: Event) => {
                      const target = e.target as HTMLInputElement
                      subField.handleChange(target.value)
                    }}
                  />
                </label>
              </div>
            {/snippet}
          </form.Field>
        {/each}

        <button
          onclick={() => field.pushValue({ name: '', age: 0 })}
          type="button"
        >
          Add person
        </button>
      </div>
    {/snippet}
  </form.Field>

  <button type="submit"> Submit </button>
</form>
