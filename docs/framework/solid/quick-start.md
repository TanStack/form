---
id: quick-start
title: Quick Start
---

The bare minimum to get started with TanStack Form is to create a form and add a field. Keep in mind that this example does not include any validation or error handling... yet.

```tsx
import { createForm } from '@tanstack/solid-form'

function App() {
  const form = createForm(() => ({
    defaultValues: {
      fullName: '',
    },
    onSubmit: async (values) => {
      // Do something with form data
      console.log(values)
    },
  }))

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <div>
            <form.Field
              name="fullName"
              children={(field) => (
                <input
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </form.Provider>
    </div>
  )
}
```

From here, you'll be ready to explore all of the other features of TanStack Form!
