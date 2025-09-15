# Server Errors & Success Flows

TanStack Form provides utilities for handling server-side validation errors and success responses through the `@tanstack/form-server` package.

## Installation

```bash
npm install @tanstack/form-server
```

## Overview

The form-server package provides three main utilities:

- **`mapServerErrors`** - Normalizes various server error formats into a consistent structure
- **`applyServerErrors`** - Applies mapped errors to form fields and form-level state
- **`onServerSuccess`** - Handles successful responses with configurable reset and callback options

## Mapping Server Errors

The `mapServerErrors` function converts different server error formats into a standardized structure:

```tsx
import { mapServerErrors } from '@tanstack/form-server'

// Zod-like errors
const zodError = {
  issues: [
    { path: ['name'], message: 'Name is required' },
    { path: ['email'], message: 'Invalid email format' }
  ]
}

const mapped = mapServerErrors(zodError)
// Result: { fields: { name: ['Name is required'], email: ['Invalid email format'] } }
```

### Supported Error Formats

The function automatically detects and handles various server error formats:

#### Zod-style Validation Errors
```tsx
const zodError = {
  issues: [
    { path: ['items', 0, 'price'], message: 'Price must be positive' }
  ]
}
// Maps to: { fields: { 'items.0.price': ['Price must be positive'] } }
```

#### Rails-style Errors
```tsx
const railsError = {
  errors: {
    name: 'Name is required',
    email: ['Invalid email', 'Email already taken']
  }
}
// Maps to: { fields: { name: ['Name is required'], email: ['Invalid email', 'Email already taken'] } }
```

#### Custom Field/Form Errors
```tsx
const customError = {
  fieldErrors: [
    { path: 'name', message: 'Name is required' }
  ],
  formError: { message: 'Form submission failed' }
}
// Maps to: { fields: { name: ['Name is required'] }, form: 'Form submission failed' }
```

### Path Mapping

Use custom path mappers to handle different naming conventions:

```tsx
const pathMapper = (path: string) => 
  path.replace(/_attributes/g, '').replace(/\[(\w+)\]/g, '.$1')

const mapped = mapServerErrors(railsError, { pathMapper })
```

## Applying Errors to Forms

Use `applyServerErrors` to inject server errors into your form:

```tsx
import { useForm } from '@tanstack/react-form'
import { mapServerErrors, applyServerErrors } from '@tanstack/form-server'

function MyForm() {
  const form = useForm({
    defaultValues: { name: '', email: '' },
    onSubmit: async ({ value }) => {
      try {
        await submitForm(value)
      } catch (serverError) {
        const mappedErrors = mapServerErrors(serverError)
        applyServerErrors(form, mappedErrors)
      }
    }
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field name="name">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </form.Field>
    </form>
  )
}
```

## Handling Success Responses

The `onServerSuccess` function provides configurable success handling:

```tsx
import { onServerSuccess } from '@tanstack/form-server'

const form = useForm({
  onSubmit: async ({ value }) => {
    try {
      const result = await submitForm(value)
      
      await onServerSuccess(form, result, {
        resetStrategy: 'values', // 'none' | 'values' | 'all'
        flash: {
          set: (message) => setFlashMessage(message),
          message: 'Form saved successfully!'
        },
        after: async () => {
          // Navigate or perform other actions
          router.push('/success')
        }
      })
    } catch (error) {
      // Handle errors...
    }
  }
})
```

### Reset Strategies

- **`'none'`** - Don't reset the form
- **`'values'`** - Reset form values but keep validation state
- **`'all'`** - Reset everything including validation state

## Complete Example

```tsx
import { useForm } from '@tanstack/react-form'
import { mapServerErrors, applyServerErrors, onServerSuccess } from '@tanstack/form-server'
import { useState } from 'react'

function UserForm() {
  const [flashMessage, setFlashMessage] = useState('')

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      profile: { bio: '' }
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value)
        })

        if (!result.ok) {
          const error = await result.json()
          const mappedErrors = mapServerErrors(error, {
            fallbackFormMessage: 'Failed to create user'
          })
          applyServerErrors(form, mappedErrors)
          return
        }

        const userData = await result.json()
        await onServerSuccess(form, userData, {
          resetStrategy: 'all',
          flash: {
            set: setFlashMessage,
            message: 'User created successfully!'
          }
        })
      } catch (error) {
        const mappedErrors = mapServerErrors(error)
        applyServerErrors(form, mappedErrors)
      }
    }
  })

  return (
    <div>
      {flashMessage && (
        <div className="success-message">{flashMessage}</div>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
        <form.Field name="name">
          {(field) => (
            <div>
              <label>Name:</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error} className="error">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error} className="error">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  )
}
```

## Framework Integration

### Next.js App Router

```tsx
import { mapServerErrors, applyServerErrors, onServerSuccess } from '@tanstack/form-server'

async function createUser(formData: FormData) {
  'use server'
  
  // Server action implementation
  try {
    const result = await db.user.create({
      data: Object.fromEntries(formData)
    })
    return { success: true, user: result }
  } catch (error) {
    return { success: false, error }
  }
}

function UserForm() {
  const form = useForm({
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      Object.entries(value).forEach(([key, val]) => {
        formData.append(key, val as string)
      })
      
      const result = await createUser(formData)
      
      if (result.success) {
        await onServerSuccess(form, result.user, {
          resetStrategy: 'all',
          flash: { set: toast.success, message: 'User created!' }
        })
      } else {
        const mappedErrors = mapServerErrors(result.error)
        applyServerErrors(form, mappedErrors)
      }
    }
  })
  
  // Form JSX...
}
```

### Remix

```tsx
import { mapServerErrors, applyServerErrors } from '@tanstack/form-server'
import { useActionData } from '@remix-run/react'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  
  try {
    const user = await createUser(Object.fromEntries(formData))
    return redirect('/users')
  } catch (error) {
    return json({ error }, { status: 400 })
  }
}

function UserForm() {
  const actionData = useActionData<typeof action>()
  
  const form = useForm({
    onSubmit: ({ value }) => {
      // Remix handles submission
    }
  })

  // Apply server errors if present
  useEffect(() => {
    if (actionData?.error) {
      const mappedErrors = mapServerErrors(actionData.error)
      applyServerErrors(form, mappedErrors)
    }
  }, [actionData])
  
  // Form JSX...
}
```
