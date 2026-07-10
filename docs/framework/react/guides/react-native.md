---
id: react-native
title: Usage with React Native
---

TanStack Form is headless, so React Native uses the same form and validation
APIs. Connect the field handlers to the props exposed by native controls.

```tsx
import { Button, Text, TextInput, View } from 'react-native'
import { useForm } from '@tanstack/react-form'

export function AccountForm() {
  const form = useForm({
    defaultValues: { age: '' },
    onSubmit: ({ value }) => console.log(value),
  })

  return (
    <View>
      <form.Field
        name="age"
        validators={[
          {
            triggers: ['change', 'blur'],
            run: ({ value }) =>
              Number(value) >= 13
                ? undefined
                : 'You must be at least 13',
          },
        ]}
      >
        {(field) => (
          <View>
            <Text>Age</Text>
            <TextInput
              value={field.value}
              keyboardType="number-pad"
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
            />
            {field.errors.map((error) => (
              <Text key={error.message} accessibilityRole="alert">
                {error.message}
              </Text>
            ))}
          </View>
        )}
      </form.Field>

      <Button title="Submit" onPress={() => void form.handleSubmit()} />
    </View>
  )
}
```

React Native has no DOM form submission or `querySelector`. Call
`form.handleSubmit()` from a button and keep refs to native inputs when you need
to focus an invalid field.
