---
id: dynamic-validation
title: Dynamic Validation
---

In many cases, you want to change the validation rules depending on the state of the form or other conditions. The most popular example of this is when you want to validate a field differently based on whether the user has submitted the form for the first time or not.

We support this through our `onDynamic` validation function.

```ts
import Component from '@glimmer/component';
import { revalidateLogic, createForm } from '@tanstack/ember-form';

export default class MyForm extends Component {
  form = createForm(this, {
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
}
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
form = createForm(this, {
  // ...
  validationLogic: revalidateLogic({
    mode: 'submit',
    modeAfterSubmission: 'blur',
  }),
  // ...
});
```

## Accessing Errors

Just as you might access errors from an `onChange` or `onBlur` validation, you can access the errors from the `onDynamic` validation function using the `form.state.errorMap` object.

```gjs
import Component from '@glimmer/component';
import { createForm, revalidateLogic } from '@tanstack/ember-form';

export default class MyForm extends Component {
  form = createForm(this, {
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

  // useStore is the recommended way to read form state in templates because
  // it returns an autotracked box. Reading `form.state.errorMap` directly in
  // a template works too, but useStore lets you select just the slice you
  // care about.
  errors = this.form.useStore((state) => state.errorMap);

  <template>
    <p>{{this.errors.current.onDynamic.firstName}}</p>
  </template>
}
```

## Usage with Other Validation Logic

You can use `onDynamic` validation alongside other validation logic, such as `onChange` or `onBlur`.

```gjs
import Component from '@glimmer/component';
import { revalidateLogic, createForm } from '@tanstack/ember-form';

export default class MyForm extends Component {
  form = createForm(this, {
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

  errors = this.form.useStore((state) => state.errorMap);

  <template>
    <div>
      <p>{{this.errors.current.onChange.firstName}}</p>
      <p>{{this.errors.current.onDynamic.lastName}}</p>
    </div>
  </template>
}
```

### Usage with Fields

You can also use `onDynamic` validation with fields, just like you would with other validation logic.

```gjs
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { createForm, revalidateLogic } from '@tanstack/ember-form';

const handleNumberInput = (field, event) =>
  field.handleChange(event.target.valueAsNumber);

export default class AgeForm extends Component {
  form = createForm(this, {
    defaultValues: {
      name: '',
      age: 0,
    },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value));
    },
  });

  validateAge = ({ value }) =>
    value > 18 ? undefined : 'Age must be greater than 18';

  submit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  };

  <template>
    <form {{on "submit" this.submit}}>
      <this.form.Field
        @name="age"
        @validators={{hash onDynamic=this.validateAge}}
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
      </this.form.Field>
      <button type="submit">Submit</button>
    </form>
  </template>
}
```

### Async Validation

Async validation can also be used with `onDynamic` just like with other validation logic. You can even debounce the async validation to avoid excessive calls.

```ts
form = createForm(this, {
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

// inside a component
form = createForm(this, {
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
