---
id: quick-start
title: Quick Start
---

The bare minimum to get started with TanStack Form is to create a form and add a field. Keep in mind that this example does not include any validation or error handling... yet.

```svelte
<script>
  import { createForm } from '@tanstack/svelte-form'

  const form = createForm(() => ({
    defaultValues: {
      fullName: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  }))
</script>

<div>
  <h1>Simple Form Example</h1>
  <form
    onsubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    }}
  >
    <div>
      <form.Field name="fullName">
        {#snippet children(field)}
          <input
            name={field.name}
            value={field.state.value}
            onblur={field.handleBlur}
            oninput={(e) => field.handleChange(e.target.value)}
          />
        {/snippet}
      </form.Field>
    </div>
    <button type="submit">Submit</button>
  </form>
</div>
```

From here, you'll be ready to explore all of the other features of TanStack Form!
