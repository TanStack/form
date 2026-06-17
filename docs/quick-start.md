# Quick Start

## Core Package

```typescript
import { FormApi } from '@tanstack/form-core'
```

## React Usage

```tsx
import { useForm } from '@tanstack/react-form'

function App() {
  const form = useForm({
    defaultValues: {
      name: '',
    },
  })

  return <form>{/* fields */}</form>
}
```

## Solid Usage

```tsx
import { createForm } from '@tanstack/solid-form'

function App() {
  const form = createForm(() => ({
    defaultValues: {
      name: '',
    },
  }))

  return <form>{/* fields */}</form>
}
```
