---
id: async-initial-values
title: Async Initial Values
---

Let's say that you want to fetch some data from an API and use it as the initial value of a form.

While this problem sounds simple on the surface, there are hidden complexities you might not have thought of thus far.

For example, you might want to show a loading spinner while the data is being fetched, or you might want to handle errors gracefully.
Likewise, you could also find yourself looking for a way to cache the data so that you don't have to fetch it every time the form is rendered.

While we could implement many of these features from scratch, it would end up looking a lot like another project we maintain: [TanStack Query](https://tanstack.com/query).

As such, this guide shows you how you can mix-n-match TanStack Form with TanStack Query to achieve the desired behavior.

## Basic Usage

TanStack Form automatically handles async initial values by delaying `onMount` listeners and validation until `defaultValues` are provided (i.e. not `undefined` or `null`).

```tsx
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'

export default function App() {
  const {data} = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {firstName: 'FirstName', lastName: "LastName"}
    }
  })

  const form = useForm({
    defaultValues: data,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  // You can show a loading spinner while waiting for data
  // The form's onMount validation/listeners will NOT run until data is available
  if (!data) {
     return <p>Loading...</p>
  }

  return (
     <form.Provider>
       <form onSubmit={(e) => {
         e.preventDefault()
         e.stopPropagation()
         form.handleSubmit()
       }}>
        <form.Field
            name="firstName"
            children={(field) => (
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
        />
        <form.Field
            name="lastName"
            children={(field) => (
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
        />
        <button type="submit">Submit</button>
       </form>
     </form.Provider>
  )
}
```

In the example above, even though `useForm` is initialized immediately, the form validation and `onMount` effects will effectively "pause" until `data` is populated. This allows you to comfortably render a loading state without triggering premature validation errors or side effects.
