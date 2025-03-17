---
id: react-native
title: Usage with React Native
---

TanStack Form is headless and it should support React Native out-of-the-box without needing any additional configuration.

Here is an example:

```tsx
import { Text, View, TextInput } from 'react-native';
import { useForm } from "@tanstack/react-form";


export default function App() {
  //Doesnt work even if changed to "Form" instead of "form"
  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  }); 
  return ( 
    <View style={{ flex: 1 }}>
      <form.Field
        name="name"
        children={(field) => (
          <Text>Enter a name!</Text> 
          <TextInput
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={(e) => field.handleChange(e)}
          />
        )}
      />
    </View>
  );
}

```
