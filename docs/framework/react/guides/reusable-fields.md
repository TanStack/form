---
id: reusable-fields
title: Creating reusable fields
---

As TanStack form is a headless library, we provide you the core building blocks and then give you the freedom to build on top of them. This page introduces the concept of creating reusable field-components for your form, allowing you to create fields that you can reuse throughout your app.

## Basic Usage

To create a reusable fields, you can do the following.

```tsx
import {  InferValidFormKeys, UseFormReturnType } from '@tanstack/react-form';

export default function GenericTextField<
  TForm,
  TFormValidator
>({ name, form }: {
  name: InferValidFormKeys<TForm, string>;
  form: UseFormReturnType<TForm, TFormValidator>,
> }): JSX.Element {
  return (
    <form.Field name={name}>
      {({ handleChange, handleBlur, state }) => (
        <input
          value={state.value}
          onChange={(e) => handleChange(e.target.value as any)}
          onBlur={handleBlur}
        />
      )}
    </form.Field>
  );
}
```

With the InferValidFormKeys the GenericTextField component's name prop will only accept the names of fields that have a valid value type, in this case a string, as shown here.

```tsx
  name: InferValidFormKeys<TForm, string>;
```

Deep values can also be inferred using this method from the parent form.

```tsx
function App() {
  const form = useForm({
    defaultValues: { name: '', id: 0, interests: {hobbies: ''} },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return <GenericTextField form={form} name="interests.hobbies" />;
}
```

## Full Example

```tsx
import { InferValidFormKeys, UseFormReturnType } from '@tanstack/react-form';

export default function GenericTextField<
  TForm,
  TFormValidator
>({ name, form }: {
  name: InferValidFormKeys<TForm, string>;
  form: UseFormReturnType<TForm, TFormValidator>
> }): JSX.Element {
  return (
    <form.Field name={name}>
      {({ handleChange, handleBlur, state }) => (
        <input
          value={state.value}
          onChange={(e) => handleChange(e.target.value as any)}
          onBlur={handleBlur}
        />
      )}
    </form.Field>
  );
}

function App() {
  const form = useForm({
    defaultValues: { name: '', id: 0, interests: {hobbies: ''} },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return <GenericTextField form={form} name="name" />;
}
```
