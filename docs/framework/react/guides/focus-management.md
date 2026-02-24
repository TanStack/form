---
id: focus-management
title: Focus Management
---

In some instances, you may want to focus the first input with an error.

[Because TanStack Form intentionally does not have insights into your markup](../../../philosophy.md), we cannot add a built-in focus management feature.

However, you can easily add this feature into your application without this hypothetical built-in feature.

## React DOM

```tsx
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export default function App() {
  const form = useForm({
    defaultValues: { age: 0 },
    validators: {
      onChange: z.object({
        age: z.number().min(12),
      }),
    },
    onSubmit() {
      alert('Submitted!')
    },
    onSubmitInvalid() {
      const InvalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement

      InvalidInput?.focus()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="age"
        children={(field) => (
          <label>
            Age
            <input
              name={field.name}
              value={field.state.value}
              aria-invalid={
                !field.state.meta.isValid && field.state.meta.isTouched
              }
              onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              type="number"
            />
          </label>
        )}
      />
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
```

## React Native

Because React Native doesn't have access to the DOM's `querySelectorAll` API, we need to manually manage the element list
of the inputs. This allows us to focus the first input with an error:

```tsx
import { useRef } from 'react'
import { Text, View, TextInput, Button, Alert } from 'react-native'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export default function App() {
  // This can be extracted to a hook that returns the `fields` ref, a `focusFirstField` function, and a `addField` function
  const fields = useRef([] as Array<{ input: TextInput; name: string }>)

  const form = useForm({
    defaultValues: { age: 0 },
    validators: {
      onChange: z.object({
        age: z.number().min(12),
      }),
    },
    onSubmit() {
      Alert.alert('Submitted!')
    },
    onSubmitInvalid({ formApi }) {
      const errorMap = formApi.state.errorMap.onChange
      const inputs = fields.current

      let firstInput
      for (const input of inputs) {
        if (!input || !input.input) continue
        if (!!errorMap[input.name]) {
          firstInput = input.input
          break
        }
      }
      firstInput?.focus()
    },
  })

  return (
    <View style={{ padding: 16 }}>
      <form.Field
        name="age"
        children={(field) => (
          <View style={{ marginVertical: 16 }}>
            <Text>Age</Text>
            <TextInput
              keyboardType="numeric"
              ref={(input) => {
                // fields.current needs to be manually incremented so that we know what fields are rendered or not and in what order
                fields.current[0] = { input, name: field.name }
              }}
              style={{
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 4,
                marginTop: 8,
                padding: 8,
              }}
              onChangeText={(val) => field.handleChange(Number(val))}
              value={field.state.value}
            />
          </View>
        )}
      />
      <Button title="Submit" onPress={form.handleSubmit} />
    </View>
  )
}
```
