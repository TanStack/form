---
id: submission-handling
title: Submission handling
---

## Passing additional data to submission handling

You may have multiple submission actions, such as continuing to another page or returning to a menu. Define the expected metadata with `onSubmitMeta`, and pass an action to `form.handleSubmit`. The metadata is available in `onSubmit` alongside the submitted value.

> If `form.handleSubmit()` is called without metadata, it uses the default from `onSubmitMeta`.

```tsrx
import { useForm } from '@tanstack/octane-form'

type FormMeta = {
  submitAction: 'continue' | 'backToMenu' | null;
}

const defaultMeta: FormMeta = {
  submitAction: null,
}

function App() @{
  const form = useForm({
    defaultValues: { data: '' },
    onSubmitMeta: defaultMeta,
    onSubmit: async ({ value, meta }) => {
      console.log(`Selected action - ${meta.submitAction}`, value)
    },
  })

  <form
    onSubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      void form.handleSubmit()
    }}
  >
    <form.Field
      name="data"
      children={(field) =>
        <input
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onInput={(event) => field.handleChange(event.currentTarget.value)}
        />}
    />
    <button
      type="button"
      onClick={() => {
        void form.handleSubmit({ submitAction: 'continue' })
      }}
    >
      Submit and continue
    </button>
    <button
      type="button"
      onClick={() => {
        void form.handleSubmit({ submitAction: 'backToMenu' })
      }}
    >
      Submit and back to menu
    </button>
    <button type="submit">Submit with the default action</button>
  </form>
}
```

The action buttons use `type="button"` because they call `handleSubmit` themselves. The regular submit button and keyboard submission go through the form's native `onSubmit` handler, which prevents browser navigation and submits with the default metadata.

## Transforming data with Standard Schemas

TanStack Form supports [Standard Schemas for validation](./validation.md), but the value passed to `onSubmit` is the schema's input data. To obtain transformed output, parse the submitted value with your schema.

```ts
import { useForm } from '@tanstack/octane-form'
import { z } from 'zod'

const schema = z.object({
  age: z.string().transform((age) => Number(age)),
})

const defaultValues: z.input<typeof schema> = {
  age: '13',
}

// Inside an Octane component:
const form = useForm({
  defaultValues,
  validators: { onChange: schema },
  onSubmit: ({ value }) => {
    const inputAge: string = value.age
    const result = schema.parse(value)
    const outputAge: number = result.age
    console.log(inputAge, outputAge)
  },
})
```
