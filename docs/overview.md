---
id: overview
title: Overview
---

TanStack Form is the ultimate solution for handling forms in web applications, providing a powerful and flexible approach to form management. Designed with first-class TypeScript support, headless UI components, and a framework-agnostic design, it streamlines form handling and ensures a seamless experience across various front-end frameworks.

## Motivation

Most web frameworks do not offer a comprehensive solution for form handling, leaving developers to create their own custom implementations or rely on less-capable libraries. This often results in a lack of consistency, poor performance, and increased development time. TanStack Form aims to address these challenges by providing an all-in-one solution for managing forms that is both powerful and easy to use.

With TanStack Form, developers can tackle common form-related challenges such as:

- Reactive data binding and state management
- Complex validation and error handling
- Accessibility and responsive design
- Internationalization and localization
- Cross-platform compatibility and custom styling

By providing a complete solution for these challenges, TanStack Form empowers developers to build robust and user-friendly forms with ease.

## Enough talk, show me some code already!

<!-- ::start:framework -->

# React

In the example below, you can see TanStack Form in action with the React framework adapter:

[Open in CodeSandbox](https://codesandbox.io/s/github/tanstack/form/tree/alpha/examples/react/simple)

<!-- ::start:tabs variant="files" -->

```tsx title="App.tsx"
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { useForm } from '@tanstack/react-form'

import { FieldInfo } from './FieldInfo.tsx'

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="firstName"
            validators={[
              {
                run: ({ value }) =>
                  !value
                    ? 'A first name is required'
                    : value.length < 3
                      ? 'First name must be at least 3 characters'
                      : undefined,
                triggers: ['change'],
              },
              {
                run: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  return (
                    value.includes('error') &&
                    'No "error" allowed in first name'
                  )
                },
                triggers: ['change'],
                triggerDebounceMs: 500,
              },
            ]}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>First Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>
        <div>
          <form.Field
            name="lastName"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
              <button
                type="reset"
                onClick={(e) => {
                  // Avoid unexpected resets of form elements (especially <select> elements)
                  e.preventDefault()
                  form.reset()
                }}
              >
                Reset
              </button>
            </>
          )}
        />
      </form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  <React.StrictMode>
    <App />

    <TanStackDevtools
      config={{ hideUntilHover: true }}
      plugins={[formDevtoolsPlugin()]}
    />
  </React.StrictMode>,
)
```

```tsx title="FieldInfo.tsx"
import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.meta.isTouched && field.meta.isInvalid ? (
        <em>{field.errors.map((error) => error.message).join(',')}</em>
      ) : null}
      {field.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
```

<!-- ::end:tabs -->

# Preact

In the example below, you can see TanStack Form in action with the Preact framework adapter:

[Open in CodeSandbox](https://codesandbox.io/s/github/tanstack/form/tree/alpha/examples/preact/simple)

<!-- ::start:tabs variant="files" -->

```tsx title="App.tsx"
import { render } from 'preact'
import { useForm } from '@tanstack/preact-form'

import { FieldInfo } from './FieldInfo.tsx'

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <div>
          <form.Field
            name="firstName"
            validators={[
              {
                run: ({ value }) =>
                  !value
                    ? 'A first name is required'
                    : value.length < 3
                      ? 'First name must be at least 3 characters'
                      : undefined,
                triggers: ['change'],
              },
              {
                run: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  return (
                    value.includes('error') &&
                    'No "error" allowed in first name'
                  )
                },
                triggers: ['change'],
                triggerDebounceMs: 500,
              },
            ]}
          >
            {(field) => (
              <>
                <label htmlFor={field.name}>First Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onBlur={field.handleBlur}
                  onInput={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
                  aria-invalid={field.meta.isInvalid}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="lastName">
            {(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onBlur={field.handleBlur}
                  onInput={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
                  aria-invalid={field.meta.isInvalid}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
              <button
                type="reset"
                onClick={(event) => {
                  event.preventDefault()
                  form.reset()
                }}
              >
                Reset
              </button>
            </>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}

render(<App />, document.getElementById('root')!)
```

```tsx title="FieldInfo.tsx"
import type { AnyFieldApi } from '@tanstack/preact-form'

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.meta.isTouched && field.meta.isInvalid ? (
        <em role="alert">
          {field.errors.map((error) => error.message).join(', ')}
        </em>
      ) : null}
      {field.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
```

<!-- ::end:tabs -->

# Solid

In the example below, you can see TanStack Form in action with the Solid framework adapter:

[Open in CodeSandbox](https://codesandbox.io/s/github/tanstack/form/tree/alpha/examples/solid/simple)

<!-- ::start:tabs variant="files" -->

```tsx title="App.tsx"
import { render } from 'solid-js/web'
import { createForm } from '@tanstack/solid-form'
import { FieldInfo } from './FieldInfo.tsx'

function App() {
  const form = createForm(() => ({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  }))

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          <form.Field
            name="firstName"
            validators={[
              {
                run: ({ value }) =>
                  !value
                    ? 'A first name is required'
                    : value.length < 3
                      ? 'First name must be at least 3 characters'
                      : undefined,
                triggers: ['change'],
              },
              {
                run: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  return (
                    value.includes('error') &&
                    'No "error" allowed in first name'
                  )
                },
                triggers: ['change'],
                triggerDebounceMs: 500,
              },
            ]}
          >
            {(field) => (
              <>
                <label for={field().name}>First Name:</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().value}
                  onBlur={field().handleBlur}
                  onInput={(event) =>
                    field().handleChange(event.currentTarget.value)
                  }
                  aria-invalid={field().meta.isInvalid}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="lastName">
            {(field) => (
              <>
                <label for={field().name}>Last Name:</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().value}
                  onBlur={field().handleBlur}
                  onInput={(event) =>
                    field().handleChange(event.currentTarget.value)
                  }
                  aria-invalid={field().meta.isInvalid}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {(state) => (
            <>
              <button type="submit" disabled={!state()[0] || state()[1]}>
                {state()[1] ? '...' : 'Submit'}
              </button>
              <button
                type="reset"
                onClick={(event) => {
                  event.preventDefault()
                  form.reset()
                }}
              >
                Reset
              </button>
            </>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
```

```tsx title="FieldInfo.tsx"
import { For, Show } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { AnyFieldApi } from '@tanstack/solid-form'

export function FieldInfo(props: { field: Accessor<AnyFieldApi> }) {
  return (
    <>
      <Show when={props.field().meta.isTouched && props.field().meta.isInvalid}>
        <em role="alert">
          <For each={props.field().errors}>
            {(error, index) => (
              <>
                {index() > 0 ? ', ' : ''}
                {error.message}
              </>
            )}
          </For>
        </em>
      </Show>
      <Show when={props.field().meta.isValidating}>Validating...</Show>
    </>
  )
}
```

<!-- ::end:tabs -->

# Lit

In the example below, you can see TanStack Form in action with the Lit framework adapter:

[Open in CodeSandbox](https://codesandbox.io/s/github/tanstack/form/tree/alpha/examples/lit/simple)

```ts title="index.ts"
import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import type { AnyFieldApi } from '@tanstack/lit-form'

function fieldInfo(field: AnyFieldApi) {
  return html`
    ${
      field.meta.isTouched && field.meta.isInvalid
        ? html`<em role="alert">
            ${field.errors.map((error) => error.message).join(', ')}
          </em>`
        : nothing
    }
    ${field.meta.isValidating ? 'Validating...' : nothing}
  `
}

@customElement('tanstack-form-demo')
export class TanStackFormDemo extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  render() {
    return html`
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          event.stopPropagation()
          void this.form.api.handleSubmit()
        }}
      >
        <div>
          ${this.form.field(
            {
              name: 'firstName',
              validators: [
                {
                  run: ({ value }) =>
                    !value
                      ? 'A first name is required'
                      : value.length < 3
                        ? 'First name must be at least 3 characters'
                        : undefined,
                  triggers: ['change'],
                },
                {
                  run: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    return value.includes('error')
                      ? 'No "error" allowed in first name'
                      : undefined
                  },
                  triggers: ['change'],
                  triggerDebounceMs: 500,
                },
              ],
            },
            (field) => html`
              <label for=${field.name}>First Name:</label>
              <input
                id=${field.name}
                name=${field.name}
                .value=${field.value}
                @blur=${() => field.handleBlur()}
                @input=${(event: InputEvent) =>
                  field.handleChange(
                    (event.currentTarget as HTMLInputElement).value,
                  )}
                aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
              />
              ${fieldInfo(field)}
            `,
          )}
        </div>
        <div>
          ${this.form.field(
            { name: 'lastName' },
            (field) => html`
              <label for=${field.name}>Last Name:</label>
              <input
                id=${field.name}
                name=${field.name}
                .value=${field.value}
                @blur=${() => field.handleBlur()}
                @input=${(event: InputEvent) =>
                  field.handleChange(
                    (event.currentTarget as HTMLInputElement).value,
                  )}
                aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
              />
              ${fieldInfo(field)}
            `,
          )}
        </div>
        ${this.form.subscribe(
          (state) => [state.canSubmit, state.isSubmitting] as const,
          ([canSubmit, isSubmitting]) => html`
            <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
              ${isSubmitting ? '...' : 'Submit'}
            </button>
            <button
              type="reset"
              @click=${(event: Event) => {
                event.preventDefault()
                this.form.api.reset()
              }}
            >
              Reset
            </button>
          `,
        )}
      </form>
    `
  }
}
```

<!-- ::end:framework -->

> Other framework adapters are coming soon and are already supported in the stable version of TanStack Form.

## You talked me into it, so what now?

- Learn TanStack Form at your own pace with our thorough [Walkthrough Guide](./installation) and [API Reference](./reference/interfaces/FormApi).
