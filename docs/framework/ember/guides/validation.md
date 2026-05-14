---
id: form-validation
title: Form and Field Validation
---

At the core of TanStack Form's functionalities is the concept of validation. TanStack Form makes validation highly customizable:

- You can control when to perform the validation (on change, on input, on blur, on submit...)
- Validation rules can be defined at the field level or at the form level
- Validation can be synchronous or asynchronous (for example, as a result of an API call)

## When is validation performed?

It's up to you! The `<Field>` component accepts a `@validators` arg whose keys (`onChange`, `onBlur`, ...) describe when each validator should run. Each validator receives the current value of the field along with the field API, so you can perform the validation. If you find a validation error, simply return the error message as a string and it will be available in `field.state.meta.errors`.

Here is an example:

```gjs
import { createForm } from '@tanstack/ember-form';

const handleNumberInput = (field, event) =>
  field.handleChange(event.target.valueAsNumber);

const validateAge = ({ value }) =>
  value < 13 ? 'You must be 13 to make an account' : undefined;

const AgeForm = createForm({
  defaultValues: { age: 0 },
});

<template>
  <AgeForm as |Form|>
    <Form.Field
      @name="age"
      @validators={{hash onChange=validateAge}}
      as |field|
    >
      <label for={{field.name}}>Age:</label>
      <input
        id={{field.name}}
        name={{field.name}}
        value={{field.state.value}}
        type="number"
        {{on "change" (fn handleNumberInput field)}}
      />
      {{#if field.state.meta.errors}}
        <em role="alert">{{field.state.meta.errors}}</em>
      {{/if}}
    </Form.Field>
  </AgeForm>
</template>
```

In the example above, the validation is done at each change. If, instead, we wanted the validation to be done when the field is blurred, we would change the code above to use `onBlur`:

```gjs
<Form.Field
  @name="age"
  @validators={{hash onBlur=validateAge}}
  as |field|
>
  <label for={{field.name}}>Age:</label>
  <input
    id={{field.name}}
    name={{field.name}}
    value={{field.state.value}}
    type="number"
    {{on "blur" field.handleBlur}}
    {{on "change" (fn handleNumberInput field)}}
  />
  {{#if field.state.meta.errors}}
    <em role="alert">{{field.state.meta.errors}}</em>
  {{/if}}
</Form.Field>
```

So you can control when the validation is done by populating the appropriate key on `@validators`. You can even perform different pieces of validation at different times:

```gjs
import { createForm } from '@tanstack/ember-form';

const validateAgeOnChange = ({ value }) =>
  value < 13 ? 'You must be 13 to make an account' : undefined;
const validateAgeOnBlur = ({ value }) =>
  value < 0 ? 'Invalid value' : undefined;

const AgeForm = createForm({ defaultValues: { age: 0 } });

<template>
  <AgeForm as |Form|>
    <Form.Field
      @name="age"
      @validators={{hash
        onChange=validateAgeOnChange
        onBlur=validateAgeOnBlur
      }}
      as |field|
    >
      {{!-- ... --}}
    </Form.Field>
  </AgeForm>
</template>
```

In the example above, we are validating different things on the same field at different times (on every change and when blurring the field). Since `field.state.meta.errors` is an array, all the relevant errors at a given time are displayed. You can also use `field.state.meta.errorMap` to get errors based on _when_ the validation was done (`onChange`, `onBlur`, etc.). More info about displaying errors below.

## Displaying Errors

Once you have your validation in place, you can map the errors from an array to be displayed in your UI:

```gjs
<Form.Field
  @name="age"
  @validators={{hash onChange=validateAge}}
  as |field|
>
  {{!-- ... --}}
  {{#if field.state.meta.errors}}
    <em role="alert">{{field.state.meta.errors}}</em>
  {{/if}}
</Form.Field>
```

> Note: `errors` is an array. Rendering it directly inside `{{ }}` will join with commas. If you want explicit control, iterate with `{{#each}}` or pre-join in a getter.

Or use the `errorMap` property to access the specific error you're looking for:

```gjs
<Form.Field
  @name="age"
  @validators={{hash onChange=validateAge}}
  as |field|
>
  {{!-- ... --}}
  {{#if field.state.meta.errorMap.onChange}}
    <em role="alert">{{field.state.meta.errorMap.onChange}}</em>
  {{/if}}
</Form.Field>
```

It's worth mentioning that our `errors` array and the `errorMap` matches the types returned by the validators. This means that:

```gjs
import { createForm } from '@tanstack/ember-form';

const validateAge = ({ value }) =>
  value < 13 ? { isOldEnough: false } : undefined;

const AgeForm = createForm({ defaultValues: { age: 0 } });

<template>
  <AgeForm as |Form|>
    <Form.Field
      @name="age"
      @validators={{hash onChange=validateAge}}
      as |field|
    >
      {{!-- errorMap.onChange is type `{isOldEnough: false} | undefined` --}}
      {{!-- meta.errors is type `Array<{isOldEnough: false} | undefined>` --}}
      {{#if field.state.meta.errorMap.onChange.isOldEnough}}
        <em>The user is not old enough</em>
      {{/if}}
    </Form.Field>
  </AgeForm>
</template>
```

## Validation at field level vs at form level

As shown above, each `<Field>` accepts its own validation rules via the `onChange`, `onBlur`, etc. keys on `@validators`. It is also possible to define validation rules at the form level (as opposed to field by field) by passing similar callbacks to the `createForm()` function.

Example:

```gjs
import { createForm, Subscribe } from '@tanstack/ember-form';

const handleSubmit = async ({ value }) => {
  console.log(value);
};

const onChangeErrorMap = (state) => state.errorMap.onChange;

const FormWithFormLevelValidation = createForm({
  defaultValues: { age: 0 },
  validators: {
    // Add validators to the form the same way you would add them to a field
    onChange({ value }) {
      if (value.age < 13) {
        return 'Must be 13 or older to sign';
      }
      return undefined;
    },
  },
});

<template>
  <FormWithFormLevelValidation @onSubmit={{handleSubmit}} as |Form|>
    <div>
      {{!-- ... --}}
      <Subscribe @form={{Form}} @selector={{onChangeErrorMap}} as |formError|>
        {{#if formError}}
          <div>
            <em>There was an error on the form: {{formError}}</em>
          </div>
        {{/if}}
      </Subscribe>
      {{!-- ... --}}
    </div>
  </FormWithFormLevelValidation>
</template>
```

`<Subscribe>` is the recommended way to read form state in templates — give it the yielded `Form` block param and a selector, and the slice is autotracked. (If you'd rather read state from JavaScript, e.g. a `@cached` getter, write a small child component that takes `@form` and calls `form.useStore(selector)` in its constructor.)

## Asynchronous Functional Validation

While we suspect most validations will be synchronous, there are many instances where a network call or some other async operation would be useful to validate against.

To do this, we have dedicated `onChangeAsync`, `onBlurAsync`, and other keys that can be used to validate against:

```gjs
import { createForm } from '@tanstack/ember-form';

const handleNumberInput = (field, event) =>
  field.handleChange(event.target.valueAsNumber);

const validateAgeAsync = async ({ value }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return value < 13 ? 'You must be 13 to make an account' : undefined;
};

const AgeForm = createForm({ defaultValues: { age: 0 } });

<template>
  <AgeForm as |Form|>
    <Form.Field
      @name="age"
      @validators={{hash onChangeAsync=validateAgeAsync}}
      as |field|
    >
      <label for={{field.name}}>Age:</label>
      <input
        id={{field.name}}
        name={{field.name}}
        value={{field.state.value}}
        type="number"
        {{on "change" (fn handleNumberInput field)}}
      />
      {{#if field.state.meta.errors}}
        <em role="alert">{{field.state.meta.errors}}</em>
      {{/if}}
    </Form.Field>
  </AgeForm>
</template>
```

Synchronous and asynchronous validations can coexist. For example, it is possible to define both `onBlur` and `onBlurAsync` on the same field:

```gjs
import { createForm } from '@tanstack/ember-form';

const validateAgeOnBlur = ({ value }) =>
  value < 13 ? 'You must be at least 13' : undefined;
const validateAgeOnBlurAsync = async ({ value }) => {
  const currentAge = await fetchCurrentAgeOnProfile();
  return value < currentAge ? 'You can only increase the age' : undefined;
};

const AgeForm = createForm({ defaultValues: { age: 0 } });

<template>
  <AgeForm as |Form|>
    <Form.Field
      @name="age"
      @validators={{hash
        onBlur=validateAgeOnBlur
        onBlurAsync=validateAgeOnBlurAsync
      }}
      as |field|
    >
      {{!-- ... --}}
    </Form.Field>
  </AgeForm>
</template>
```

The synchronous validation method (`onBlur`) is run first and the asynchronous method (`onBlurAsync`) is only run if the synchronous one (`onBlur`) succeeds. To change this behaviour, set the `@asyncAlways` arg to `true`, and the async method will be run regardless of the result of the sync method.

### Built-in Debouncing

While async calls are the way to go when validating against the database, running a network request on every keystroke is a good way to DDOS your database.

Instead, we enable an easy method for debouncing your `async` calls by adding a single arg:

```gjs
<Form.Field
  @name="age"
  @asyncDebounceMs={{500}}
  @validators={{hash onChangeAsync=validateAgeAsync}}
  as |field|
>
  {{!-- ... --}}
</Form.Field>
```

This will debounce every async call with a 500ms delay. You can even override this on a per-validator basis using the matching `*DebounceMs` key:

```gjs
<Form.Field
  @name="age"
  @asyncDebounceMs={{500}}
  @validators={{hash
    onChangeAsyncDebounceMs=1500
    onChangeAsync=validateAgeOnChangeAsync
    onBlurAsync=validateAgeOnBlurAsync
  }}
  as |field|
>
  {{!-- ... --}}
</Form.Field>
```

> This will run `onChangeAsync` every 1500ms while `onBlurAsync` will run every 500ms.

## Validation through Schema Libraries

While functions provide more flexibility and customization over your validation, they can be a bit verbose. To help solve this, there are libraries that provide schema-based validation to make shorthand and type-strict validation substantially easier. You can also define a single schema for your entire form and pass it to the form level; errors will be automatically propagated to the fields.

### Standard Schema Libraries

TanStack Form natively supports all libraries following the [Standard Schema specification](https://github.com/standard-schema/standard-schema), most notably:

- [Zod](https://zod.dev/)
- [Valibot](https://valibot.dev/)
- [ArkType](https://arktype.io/)

_Note:_ make sure to use the latest version of the schema libraries as older versions might not support Standard Schema yet.

To use schemas from these libraries you can pass them to `@validators` the same way you would a custom function:

```gjs
import { z } from 'zod';
import { createForm } from '@tanstack/ember-form';

const ageSchema = z.number().gte(13, 'You must be 13 to make an account');

const AgeForm = createForm({ defaultValues: { age: 0 } });

<template>
  <AgeForm as |Form|>
    <Form.Field
      @name="age"
      @validators={{hash onChange=ageSchema}}
      as |field|
    >
      {{!-- ... --}}
    </Form.Field>
  </AgeForm>
</template>
```

Async validations on form and field level are supported as well:

```gjs
import { z } from 'zod';
import { createForm } from '@tanstack/ember-form';

const ageSchema = z.number().gte(13, 'You must be 13 to make an account');
const ageSchemaAsync = z.number().refine(
  async (value) => {
    const currentAge = await fetchCurrentAgeOnProfile();
    return value >= currentAge;
  },
  { message: 'You can only increase the age' },
);

const AgeForm = createForm({ defaultValues: { age: 0 } });

<template>
  <AgeForm as |Form|>
    <Form.Field
      @name="age"
      @validators={{hash
        onChange=ageSchema
        onChangeAsyncDebounceMs=500
        onChangeAsync=ageSchemaAsync
      }}
      as |field|
    >
      {{!-- ... --}}
    </Form.Field>
  </AgeForm>
</template>
```

## Preventing invalid forms from being submitted

The `onChange`, `onBlur`, etc. callbacks are also run when the form is submitted and the submission is blocked if the form is invalid.

The form state object has a `canSubmit` flag that is false when any field is invalid and the form has been touched (`canSubmit` is true until the form has been touched, even if some fields are "technically" invalid based on their `onChange`/`onBlur` props).

You can subscribe to it via `<Subscribe>` and use the value in order to, for example, disable the submit button when the form is invalid (in practice, disabled buttons are not accessible, use `aria-disabled` instead).

```gjs
import { createForm, Subscribe } from '@tanstack/ember-form';

// Pre-compute negation in the selector — strict-mode templates can't write
// {{!state.canSubmit}} inline.
const submitButtonState = (state) => ({
  cantSubmit: !state.canSubmit,
  isSubmitting: state.isSubmitting,
});

const FormWithSubmitGate = createForm({
  /* ... */
});

<template>
  <FormWithSubmitGate as |Form|>
    {{!-- ... --}}

    {{!-- Dynamic submit button --}}
    <Subscribe @form={{Form}} @selector={{submitButtonState}} as |slice|>
      <button type="submit" disabled={{slice.cantSubmit}}>
        {{if slice.isSubmitting "..." "Submit"}}
      </button>
    </Subscribe>
  </FormWithSubmitGate>
</template>
```

To prevent the form from being submitted before any interaction, combine `canSubmit` with `isPristine` flags. A simple condition like `!canSubmit || isPristine` (computed inside the selector) effectively disables submissions until the user has made changes.
