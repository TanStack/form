---
id: quick-start
title: Quick Start
---

TanStack Form is designed for production usage, with a focus on type safety, performance, and composition.

Our [philosophy around the library's usage](../../philosophy.md) values scalability and long-term developer experience. The Octane adapter follows the same approach, with components authored in TSRX.

## Set up Octane and TSRX

Install the form adapter and Octane, along with Vite and the TSRX TypeScript tooling:

```sh
pnpm add @tanstack/octane-form octane zod
pnpm add -D vite typescript @tsrx/typescript-plugin
```

Configure Vite to compile your `.tsrx` files and the adapter's source modules:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { octane } from 'octane/compiler/vite'

export default defineConfig({
  plugins: [octane()],
})
```

For TypeScript and editor support, configure your project for Octane:

```json
{
  "tsrx": {
    "compiler": "octane/compiler/volar"
  },
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "jsxImportSource": "octane",
    "allowImportingTsExtensions": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "plugins": [{ "name": "@tsrx/typescript-plugin" }]
  },
  "include": ["src", "vite.config.ts"]
}
```

Use `tsrx-tsc --noEmit -p tsconfig.json` to check both TypeScript and TSRX. An HTML entry with `<div id="root"></div>` can load your form through `<script type="module" src="/src/index.tsrx"></script>`. The [simple example](./examples/simple) includes the complete Vite setup.

## Compose reusable form components

The following `src/index.tsrx` example defines reusable inputs and a submit button, then binds them to a form hook. In a larger app, move these components and contexts into their own modules as described in [Form Composition](./guides/form-composition.md).

```tsrx
import { createRoot } from 'octane'
import { createFormHook, createFormHookContexts } from '@tanstack/octane-form'
// Valibot, ArkType, and other Standard Schema libraries work too.
import { z } from 'zod'

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

function TextField({ label }: { label: string }) @{
  const field = useFieldContext<string>()

  <label>
    <span>{label}</span>
    <input
      name={field.name}
      value={field.state.value}
      onInput={(event) => field.handleChange(event.currentTarget.value)}
      onBlur={field.handleBlur}
    />
  </label>
}

function NumberField({ label }: { label: string }) @{
  const field = useFieldContext<number>()

  <label>
    <span>{label}</span>
    <input
      type="number"
      name={field.name}
      value={field.state.value}
      onInput={(event) => field.handleChange(event.currentTarget.valueAsNumber)}
      onBlur={field.handleBlur}
    />
    @if (field.state.meta.isTouched && !field.state.meta.isValid) {
      <em>{field.state.meta.errors.map((error) => error.message).join(
        ', ',
      )}</em>
    }
  </label>
}

function SubmitButton() @{
  const form = useFormContext()

  <form.Subscribe
    selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    children={([canSubmit, isSubmitting]) => <button
      type="submit"
      disabled={!canSubmit}
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>}
  />
}

// Define this hook once for consistent, type-safe forms throughout your app.
const { useAppForm } = createFormHook({
  fieldComponents: { TextField, NumberField },
  formComponents: { SubmitButton },
  fieldContext,
  formContext,
})

function PeoplePage() @{
  const form = useAppForm({
    defaultValues: {
      username: '',
      age: 0,
    },
    validators: {
      onChange: z.object({
        username: z.string(),
        age: z.number().min(13),
      }),
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  <form
    onSubmit={(event) => {
      event.preventDefault()
      void form.handleSubmit()
    }}
  >
    <h1>Personal Information</h1>
    <form.AppField
      name="username"
      children={(field) => <field.TextField label="Full Name" />}
    />
    <form.AppField
      name="age"
      children={(field) => <field.NumberField label="Age" />}
    />
    <form.AppForm>
      <form.SubmitButton />
    </form.AppForm>
  </form>
}

const rootElement = document.getElementById('root')!
createRoot(rootElement).render(PeoplePage)
```

Octane uses native DOM events. Use `onInput` to update text and number fields as the user types, while keeping TanStack Form's validator names such as `onChange`. Mount the component function with `createRoot(...).render(PeoplePage)`.

## Use a form directly

While we suggest `createFormHook` for shared components, `useForm` and `form.Field` also support one-off forms:

```tsrx
import { createRoot } from 'octane'
import { useForm } from '@tanstack/octane-form'

function PeoplePage() @{
  const form = useForm({
    defaultValues: { age: 0 },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  <form
    onSubmit={(event) => {
      event.preventDefault()
      void form.handleSubmit()
    }}
  >
    <form.Field
      name="age"
      validators={{
        onChange: ({ value }) => value >= 13
          ? undefined
          : 'Must be 13 or older',
      }}
      children={(field) => <label>
        <span>Age</span>
        <input
          name={field.name}
          value={field.state.value}
          type="number"
          onBlur={field.handleBlur}
          onInput={(event) => field.handleChange(
            event.currentTarget.valueAsNumber,
          )}
        />
        @if (field.state.meta.isTouched && !field.state.meta.isValid) {
          <em>{field.state.meta.errors.join(', ')}</em>
        }
      </label>}
    />
    <button type="submit">Submit</button>
  </form>
}

const rootElement = document.getElementById('root')!
createRoot(rootElement).render(PeoplePage)
```

All options from `useForm` can be used in `useAppForm`, and all properties from `form.Field` can be used in `form.AppField`.
