---
id: dynamic-validation
title: Dynamic Validation
---

In many cases, you want to change the validation rules depending on the state of the form or other conditions. The most popular example of this is when you want to validate a field differently based on whether the user has submitted the form for the first time or not.

We support this through our `onDynamic` validation function.

```ts
import { revalidateLogic, createForm } from '@tanstack/ember-form';

const MyForm = createForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  // If this is omitted, onDynamic will not be called
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: ({ value }) => {
      if (!value.firstName) {
        return { firstName: 'A first name is required' };
      }
      return undefined;
    },
  },
});
```

> By default `onDynamic` is not called, so you need to pass `revalidateLogic()` to the `validationLogic` option of `createForm`.

## Revalidation Options

`revalidateLogic` allows you to specify when validation should be run and change the validation rules dynamically based on the current submission state of the form.

It takes two arguments:

- `mode`: The mode of validation prior to the first form submission. This can be one of the following:
  - `change`: Validate on every change.
  - `blur`: Validate on blur.
  - `submit`: Validate on submit. (**default**)

- `modeAfterSubmission`: The mode of validation after the form has been submitted. This can be one of the following:
  - `change`: Validate on every change. (**default**)
  - `blur`: Validate on blur.
  - `submit`: Validate on submit.

You can, for example, use the following to revalidate on blur after the first submission:

```ts
const MyForm = createForm({
  // ...
  validationLogic: revalidateLogic({
    mode: 'submit',
    modeAfterSubmission: 'blur',
  }),
  // ...
});
```

## Accessing Errors

Just as you might access errors from an `onChange` or `onBlur` validation, you can access the errors from the `onDynamic` validation function using the `state.errorMap` object yielded by `<Subscribe>`.

```gjs
import { createForm, revalidateLogic, Subscribe } from '@tanstack/ember-form';

const onDynamicFirstName = (state) => state.errorMap.onDynamic?.firstName;

const MyForm = createForm({
  // ...
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: ({ value }) => {
      if (!value.firstName) {
        return { firstName: 'A first name is required' };
      }
      return undefined;
    },
  },
});

<template>
  <MyForm as |Form|>
    <Subscribe @form={{Form}} @selector={{onDynamicFirstName}} as |error|>
      <p>{{error}}</p>
    </Subscribe>
  </MyForm>
</template>
```

> `<Subscribe>` is the most ergonomic way to read form state in a template. If you'd rather read state in JavaScript (e.g. a `@cached` getter), write a tiny child component that takes `@form` and calls `form.useStore(selector)` in its constructor — `useStore` returns an autotracked box whose `.current` re-renders only when the selected slice changes.

## Usage with Other Validation Logic

You can use `onDynamic` validation alongside other validation logic, such as `onChange` or `onBlur`.

```gjs
import { createForm, revalidateLogic, Subscribe } from '@tanstack/ember-form';

const onChangeFirstName = (state) => state.errorMap.onChange?.firstName;
const onDynamicLastName = (state) => state.errorMap.onDynamic?.lastName;

const MyForm = createForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  validationLogic: revalidateLogic(),
  validators: {
    onChange: ({ value }) => {
      if (!value.firstName) {
        return { firstName: 'A first name is required' };
      }
      return undefined;
    },
    onDynamic: ({ value }) => {
      if (!value.lastName) {
        return { lastName: 'A last name is required' };
      }
      return undefined;
    },
  },
});

<template>
  <MyForm as |Form|>
    <div>
      <Subscribe @form={{Form}} @selector={{onChangeFirstName}} as |error|>
        <p>{{error}}</p>
      </Subscribe>
      <Subscribe @form={{Form}} @selector={{onDynamicLastName}} as |error|>
        <p>{{error}}</p>
      </Subscribe>
    </div>
  </MyForm>
</template>
```

### Usage with Fields

You can also use `onDynamic` validation with fields, just like you would with other validation logic.

```gjs
import { createForm, revalidateLogic } from '@tanstack/ember-form';

const handleNumberInput = (field, event) =>
  field.handleChange(event.target.valueAsNumber);

const validateAge = ({ value }) =>
  value > 18 ? undefined : 'Age must be greater than 18';

const onSubmitFor = (form) => (event) => {
  event.preventDefault();
  event.stopPropagation();
  form.handleSubmit();
};

const handleSubmit = ({ value }) => {
  alert(JSON.stringify(value));
};

const AgeForm = createForm({
  defaultValues: {
    name: '',
    age: 0,
  },
  validationLogic: revalidateLogic(),
});

<template>
  <AgeForm @onSubmit={{handleSubmit}} as |Form|>
    <form {{on "submit" (onSubmitFor Form)}}>
      <Form.Field
        @name="age"
        @validators={{hash onDynamic=validateAge}}
        as |field|
      >
        <div>
          <input
            type="number"
            value={{field.state.value}}
            {{on "change" (fn handleNumberInput field)}}
            {{on "blur" field.handleBlur}}
          />
          <p style="color: red">
            {{field.state.meta.errorMap.onDynamic}}
          </p>
        </div>
      </Form.Field>
      <button type="submit">Submit</button>
    </form>
  </AgeForm>
</template>
```

> If a validator needs to depend on per-instance state (e.g. props passed to the surrounding component), construct it inside a wrapper Glimmer component that takes the form as `@form` and stores the validator as a class field. The wrapper can then render `<@form.Field @validators={{hash onDynamic=this.validateAge}}>`. The reactive-args path keeps working — anything that wraps a `Field` to provide `@validators` from `this.args` will re-sync.

### Async Validation

Async validation can also be used with `onDynamic` just like with other validation logic. You can even debounce the async validation to avoid excessive calls.

```ts
const UsernameForm = createForm({
  defaultValues: {
    username: '',
  },
  validationLogic: revalidateLogic(),
  validators: {
    onDynamicAsyncDebounceMs: 500, // Debounce the async validation by 500ms
    onDynamicAsync: async ({ value }) => {
      if (!value.username) {
        return { username: 'Username is required' };
      }
      // Simulate an async validation
      const isValid = await validateUsername(value.username);
      return isValid ? undefined : { username: 'Username is already taken' };
    },
  },
});
```

### Standard Schema Validation

You can also use standard schema validation libraries like Valibot or Zod with `onDynamic` validation. This allows you to define complex validation rules that can change dynamically based on the form state.

```ts
import { z } from 'zod';
import { createForm, revalidateLogic } from '@tanstack/ember-form';

const schema = z.object({
  firstName: z.string().min(1, 'A first name is required'),
  lastName: z.string().min(1, 'A last name is required'),
});

const MyForm = createForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: schema,
  },
});
```
