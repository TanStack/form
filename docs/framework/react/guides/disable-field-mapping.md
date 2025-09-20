# disableFieldMapping

The `disableFieldMapping` option allows you to control whether schema validation errors are applied to specific fields. This is useful when implementing conditional validation, multi-step forms, or custom validation logic.

## Basic Usage

### Global Disable

To disable schema validation errors for all fields, set `disableFieldMapping` to `true`:

```tsx
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Valid email is required'),
})

function MyForm() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
    },
    validators: {
      onChange: schema,
    },
    disableFieldMapping: true,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="username">
        {(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
    </form>
  )
}
```

### Selective Disable

You can selectively disable schema validation for specific fields:

```tsx
function MyForm() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    validators: {
      onChange: schema,
    },
    disableFieldMapping: {
      fields: {
        username: true,
        email: false,
      },
    },
  })

  return (
    <form>
      <form.Field name="username">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        )}
      </form.Field>
    </form>
  )
}
```

## Use Cases

### 1. Conditional Validation

You can dynamically control validation based on user input state or form state:

```tsx
function ConditionalValidationForm() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const form = useForm({
    defaultValues: {
      basicField: '',
      advancedField: '',
    },
    validators: {
      onChange: schema,
    },
    disableFieldMapping: {
      fields: {
        advancedField: !showAdvanced, 
      },
    },
  })

  return (
    <form>
      <form.Field name="basicField">
        {(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </button>

      {showAdvanced && (
        <form.Field name="advancedField">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      )}
    </form>
  )
}
```

### 2. Multi-step Forms

When you want to validate only the current step's fields in a multi-step form:

```tsx
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  
  const form = useForm({
    defaultValues: {
      step1Field: '',
      step2Field: '',
      step3Field: '',
    },
    validators: {
      onChange: schema,
    },
    disableFieldMapping: {
      fields: {
        step1Field: currentStep !== 1,
        step2Field: currentStep !== 2,
        step3Field: currentStep !== 3,
      },
    },
  })

  return (
    <form>
      {currentStep === 1 && (
        <form.Field name="step1Field">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      )}
      
      {currentStep === 2 && (
        <form.Field name="step2Field">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      )}

      <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
        Next Step
      </button>
    </form>
  )
}
```

### 3. Using with Custom Validation

When you want to use field-specific custom validation instead of schema validation:

```tsx
function CustomValidationForm() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
    },
    validators: {
      onChange: schema,
    },
    disableFieldMapping: {
      fields: {
        username: true, 
      },
    },
  })

  return (
    <form>
      <form.Field
        name="username"
        validators={{
          onChange: ({ value }) => {
            if (value.length < 3) {
              return 'Username must be at least 3 characters'
            }
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
              return 'Username can only contain letters, numbers, and underscores'
            }
            return undefined
          },
        }}
      >
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        )}
      </form.Field>
    </form>
  )
}
```

## Runtime Configuration Changes

You can dynamically change the `disableFieldMapping` configuration using the `form.update()` method even after the form is created:

```tsx
function DynamicConfigForm() {
  const form = useForm({
    defaultValues: { username: '', email: '' },
    validators: { onChange: schema },
    disableFieldMapping: false,
  })

  const toggleValidation = () => {
    form.update({
      disableFieldMapping: !form.options.disableFieldMapping,
    })
  }

  return (
    <form>
      <button type="button" onClick={toggleValidation}>
        {form.options.disableFieldMapping ? 'Enable' : 'Disable'} Validation
      </button>
      
      <form.Field name="username">
        {(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
    </form>
  )
}
```

## Important Notes

1. **Field-level validation is unaffected**: `disableFieldMapping` only controls schema validation; field-level `validators` options still work.

2. **Form-level validation**: Validation during form submission runs regardless of `disableFieldMapping` settings.

3. **Type safety**: When using TypeScript, field names must be keys defined in the form data type.

## API Reference

```typescript
interface FieldMappingConfig<TFormData> {
  fields?: Partial<Record<DeepKeys<TFormData>, boolean>>
}

interface FormOptions<TFormData> {
  disableFieldMapping?: boolean | FieldMappingConfig<TFormData>
}
```

- `true`: Disable schema validation for all fields
- `false` or `undefined`: Enable schema validation for all fields (default)
- `{ fields: { fieldName: boolean } }`: Fine-grained field control
  - `true`: Disable schema validation for that field
  - `false`: Enable schema validation for that field
  - Fields not specified: Use default (enabled)
