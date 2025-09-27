# disableFieldMapping Example

This example demonstrates the `disableFieldMapping` feature of TanStack Form.

## Feature Description

`disableFieldMapping` is a feature that allows you to control whether schema validation errors are applied to specific fields.

### Usage

#### 1. Global Disable
```typescript
const form = useForm({
  // ... other options
  disableFieldMapping: true, // Disable schema errors for all fields
})
```

#### 2. Selective Disable
```typescript
const form = useForm({
  // ... other options
  disableFieldMapping: {
    fields: {
      username: true,  // Disable schema errors for username field only
      email: false,    // Enable schema errors for email field
      // Fields not specified use default (enabled)
    },
  },
})
```

### Use Cases

1. **Conditional Validation**: Disable schema validation for some fields only under specific conditions
2. **Multi-step Forms**: Validate only current step fields in multi-step forms
3. **Custom Validation**: Use field-specific custom validation instead of schema validation
4. **UX Improvement**: Hide errors for fields the user hasn't interacted with yet

## How to Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:3000` in your browser to see the example.

## Example Structure

This example shows three forms:

1. **Default Form**: Schema validation applied to all fields
2. **Global Disable Form**: Schema validation disabled for all fields
3. **Selective Disable Form**: username disabled, email enabled

Try the same inputs in each form to see the differences based on `disableFieldMapping` configuration.
