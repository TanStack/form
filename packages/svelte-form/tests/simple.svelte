<script type="ts">
import { createForm } from '../src/index.js'
import type { FieldApi, FormOptions } from '../src/index.js'

interface Employee {
  firstName: string
  lastName: string
  color?: '#FF0000' | '#00FF00' | '#0000FF'
  employed: boolean
  jobTitle: string
}

const sampleData: Employee = {
  firstName: 'Bob',
  lastName: '',
  employed: false,
  jobTitle: '',
}

const formConfig: FormOptions<Employee, undefined> = {
  defaultValues: sampleData,
}

const form = createForm(() => ({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
  },
}))

</script>
<form
  id="form"
  on:submit|preventDefault={form.onSubmit}
>
  <h1>TanStack Form - Svelte Demo</h1>

  <form.Field
    name="firstName"
    validators={{
      onChange: ({ value }) =>
        value.length < 3 ? 'Not long enough' : undefined,
    }}
  >
    {#snippet children(field)}
      <div>
        <label>First Name</label>
        <input
          id="firstName"
          type="text"
          placeholder="First Name"
          value={field.state.value}
          on:blur={() => field.handleBlur()}
          on:input={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
        />
      </div>
    {/snippet}
  </form.Field>
  <form.Field
    name="lastName"
    validators={{
      onChange: ({ value }) =>
        value.length < 3 ? 'Not long enough' : undefined,
    }}
  >
    {#snippet children(field)}
      <div>
        <label>Last Name</label>
        <input
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={field.state.value}
          on:blur={() => field.handleBlur()}
          on:input={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
        />
      </div>
    {/snippet}
  </form.Field>
  <form.Field
    name="color"
  >
    {#snippet children(field)}
      <div>
        <label>Favorite Color</label>
        <select
          value={field.state.value}
          on:blur={() => field.handleBlur()}
          on:input={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(
              target.value as '#FF0000' | '#00FF00' | '#0000FF',
            )
          }}
        >
          <option value="#FF0000">Red</option>
          <option value="#00FF00">Green</option>
          <option value="#0000FF">Blue</option>
        </select>
      </div>
    {/snippet}
  </form.Field>
  <form.Field
    name="employed"
  >
    {#snippet children(field)}
      <div>
        <label>Employed?</label>
        <input
          on:input={() => field.handleChange(!field.state.value)}
          checked={field.state.value}
          on:blur={() => field.handleBlur()}
          id="employed"
          type="checkbox"
        />
      </div>
      {#if field.state.value}
        <form.Field
          name="jobTitle"
          validators={{
            onChange: ({ value }) =>
              value.length === 0
                ? 'Needs to have a job here'
                : null,
          }}
        >
          {#snippet children(field)}
            <div>
              <label>Job Title</label>
              <input
                type="text"
                id="jobTitle"
                placeholder="Job Title"
                value={subField.state.value}
                on:blur={() => subField.handleBlur()}
                on:input={(e: Event) => {
                  const target = e.target as HTMLInputElement
                  subField.handleChange(target.value)
                }}
              />
            </div>
          {/snippet}
        </form.Field>
      {/if}
    {/snippet}
  </form.Field>
  <div>
    <button
      type="submit"
      disabled={form.api.state.isSubmitting}
    >
      {form.api.state.isSubmitting ? html` Submitting` : 'Submit'}
    </button>
    <button
      type="button"
      id="reset"
      on:click={() => {
        form.api.reset()
      }}
    >
      Reset
    </button>
  </div>
</form>
<pre>{JSON.stringify(form.api.state, null, 2)}</pre>
