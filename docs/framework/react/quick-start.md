---
id: quick-start
title: Quick Start
---

The bare minimum to get started with TanStack Form is to create a form and add a field. Keep in mind that this example does not include any validation or error handling... yet.

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { useForm } from '@tanstack/react-form'

export default function App() {
  const form = useForm({
    // Memoize your default values to prevent re-renders
    defaultValues: React.useMemo(
      () => ({
        fullName: '',
      }),
      [],
    ),
    onSubmit: async (values) => {
      // Do something with form data
      console.log(values)
    },
  })

  return (
    <div>
      <form {...form.getFormProps()}>
        <div>
          <form.Field
            name="fullName"
            children={(field) => (
              <input name={field.name} {...field.getInputProps()} />
            )}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(<App />)
```

From here, you'll be ready to explore all of the other features of TanStack Form!
