---
id: basic-concepts
title: Basic Concepts and Terminology
---

This page introduces the basic concepts and terminology used in the `@tanstack/ember-form` library. Familiarizing yourself with these concepts will help you better understand and work with the library.

## Form Options

You can create options for your form so that they can be shared between multiple forms by using the `formOptions` function.

Example:

```ts
import { formOptions } from '@tanstack/ember-form';

interface Person {
  firstName: string;
  lastName: string;
  hobbies: Array<string>;
}

const defaultPerson: Person = { firstName: '', lastName: '', hobbies: [] };

const formOpts = formOptions({
  defaultValues: defaultPerson,
});
```

## Form Component

`createForm` returns a Glimmer component. Call it once at module scope with the options that are shared across every invocation (default values, form-level validators, etc.), then invoke the returned component in a template — once or many times. Each invocation creates its own form instance, with a lifetime tied to that invocation.

Anything that varies per instance — most notably `onSubmit`, which usually closes over component state — is passed as a template arg on the invocation rather than baked into `createForm`.

```gjs
import { createForm, formOptions } from '@tanstack/ember-form';

interface Person {
  firstName: string;
  lastName: string;
  hobbies: Array<string>;
}

const formOpts = formOptions({
  defaultValues: { firstName: '', lastName: '', hobbies: [] } as Person,
});

const MyForm = createForm(formOpts);

const handleSubmit = async ({ value }) => {
  // Do something with form data
  console.log(value);
};

<template>
  <MyForm @onSubmit={{handleSubmit}} as |tanstackForm|>
    {{!-- ...fields go here, using tanstackForm.Field... --}}
  </MyForm>
</template>
```

You may also build the options inline:

```gjs
import { createForm } from '@tanstack/ember-form';

interface Person {
  firstName: string;
  lastName: string;
  hobbies: Array<string>;
}

const MyForm = createForm<Person>({
  defaultValues: {
    firstName: '',
    lastName: '',
    hobbies: [],
  },
});

const handleSubmit = async ({ value }) => {
  console.log(value);
};

<template>
  <MyForm @onSubmit={{handleSubmit}} as |tanstackForm|>
    {{!-- ... --}}
  </MyForm>
</template>
```

> The invocation yields a block param — `tanstackForm` in the examples above. Name it `tanstackForm` by default; a block param named `form` would shadow the HTML `<form>` element (in Glimmer strict mode `<form>` then resolves to the lexical binding and Glimmer tries to render the form object as a component). In examples that include a literal `<form>` element, use the short alias `f` instead. Use the block param to render fields (`<tanstackForm.Field>`) and to feed `<Subscribe @form={{tanstackForm}}>`.

## Field

A Field represents a single form input element, such as a text input or a checkbox. Fields are created using the `<Field>` component, either via the closure-bound `tanstackForm.Field` yielded from the invocation, or by importing `Field` from `@tanstack/ember-form` and passing `@form={{tanstackForm}}` explicitly. The component accepts a `@name` arg, which should match a key in the form's default values, and yields a field object to its block.

Example:

```gjs
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);

const FirstNameForm = createForm({
  defaultValues: { firstName: '' },
});

<template>
  <FirstNameForm as |tanstackForm|>
    <tanstackForm.Field @name="firstName" as |field|>
      <input
        name={{field.name}}
        value={{field.state.value}}
        {{on "blur" field.handleBlur}}
        {{on "input" (fn handleInput field)}}
      />
    </tanstackForm.Field>
  </FirstNameForm>
</template>
```

## Field State

Each field has its own state, which includes its current value, validation status, error messages, and other metadata. You can access a field's state using the `field.state` property.

Example:

```ts
const {
  value,
  meta: { errors, isValidating },
} = field.state;
```

There are four states in the metadata that can be useful to see how the user interacts with a field:

- _"isTouched"_, after the user changes the field or blurs the field
- _"isDirty"_, after the field's value has been changed, even if it's been reverted to the default. Opposite of `isPristine`
- _"isPristine"_, until the user changes the field value. Opposite of `isDirty`
- _"isBlurred"_, after the field has been blurred

```ts
const { isTouched, isDirty, isPristine, isBlurred } = field.state.meta;
```

![Field states](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states.png)

## Understanding 'isDirty' in Different Libraries

Non-Persistent `dirty` state

- **Libraries**: React Hook Form (RHF), Formik, Final Form.
- **Behavior**: A field is 'dirty' if its value differs from the default. Reverting to the default value makes it 'clean' again.

Persistent `dirty` state

- **Libraries**: Angular Form, Vue FormKit.
- **Behavior**: A field remains 'dirty' once changed, even if reverted to the default value.

We have chosen the persistent 'dirty' state model. To also support a non-persistent 'dirty' state, we introduce an additional flag:

- _"isDefaultValue"_, whether the field's current value is the default value

```ts
const { isDefaultValue, isTouched } = field.state.meta;

// The following line will re-create the non-Persistent `dirty` functionality.
const nonPersistentIsDirty = !isDefaultValue;
```

![Field states extended](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states-extended.png)

## Field API

The Field API is the object yielded from the `<Field>` block. It provides methods for working with the field's state.

Example:

```gjs
<tanstackForm.Field @name="firstName" as |field|>
  <input
    name={{field.name}}
    value={{field.state.value}}
    {{on "blur" field.handleBlur}}
    {{on "input" (fn handleInput field)}}
  />
</tanstackForm.Field>
```

Reading `field.state.value` inside a template entangles with Glimmer's autotracking system, so the input re-renders whenever the underlying store changes — no manual subscription required.

## Validation

`@tanstack/ember-form` provides both synchronous and asynchronous validation out of the box. Validation functions can be passed to the `<Field>` component using the `@validators` arg, typically built up with the `hash` helper.

Example:

```gjs
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);

const validateFirstName = ({ value }) =>
  !value
    ? 'A first name is required'
    : value.length < 3
      ? 'First name must be at least 3 characters'
      : undefined;

const validateFirstNameAsync = async ({ value }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return value.includes('error') && 'No "error" allowed in first name';
};

const FirstNameForm = createForm({
  defaultValues: { firstName: '' },
});

<template>
  <FirstNameForm as |tanstackForm|>
    <tanstackForm.Field
      @name="firstName"
      @validators={{hash
        onChange=validateFirstName
        onChangeAsync=validateFirstNameAsync
      }}
      as |field|
    >
      <input
        name={{field.name}}
        value={{field.state.value}}
        {{on "blur" field.handleBlur}}
        {{on "input" (fn handleInput field)}}
      />
      <p>{{field.state.meta.errors.[0]}}</p>
    </tanstackForm.Field>
  </FirstNameForm>
</template>
```

## Validation with Standard Schema Libraries

In addition to hand-rolled validation options, we also support the [Standard Schema](https://github.com/standard-schema/standard-schema) specification.

You can define a schema using any of the libraries implementing the specification and pass it to a form or field validator.

Supported libraries include:

- [Zod](https://zod.dev/) (v3.24.0 or higher)
- [Valibot](https://valibot.dev/) (v1.0.0 or higher)
- [ArkType](https://arktype.io/) (v2.1.20 or higher)
- [Yup](https://github.com/jquense/yup) (v1.7.0 or higher)

```gjs
import { z } from 'zod';
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);

const firstNameSchema = z
  .string()
  .min(3, 'First name must be at least 3 characters');
const firstNameSchemaAsync = z.string().refine(
  async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return !value.includes('error');
  },
  { message: 'No "error" allowed in first name' },
);

const FirstNameForm = createForm({
  defaultValues: { firstName: '' },
});

<template>
  <FirstNameForm as |tanstackForm|>
    <tanstackForm.Field
      @name="firstName"
      @validators={{hash
        onChange=firstNameSchema
        onChangeAsyncDebounceMs=500
        onChangeAsync=firstNameSchemaAsync
      }}
      as |field|
    >
      <input
        name={{field.name}}
        value={{field.state.value}}
        {{on "blur" field.handleBlur}}
        {{on "input" (fn handleInput field)}}
      />
      <p>{{field.state.meta.errors.[0]}}</p>
    </tanstackForm.Field>
  </FirstNameForm>
</template>
```

## Reactivity

`@tanstack/ember-form` offers various ways to subscribe to form and field state changes, most notably the `form.useStore` method and the `<Subscribe>` component. These let you optimize your form's rendering by only updating components when necessary.

`<Subscribe>` is the most ergonomic option when you want a reactive slice in a template — it takes the form (the yielded block param) and a selector and yields the selected slice to its block.

Example:

```gjs
import { createForm, Subscribe } from '@tanstack/ember-form';

const submitButtonState = (state) => ({
  canSubmit: state.canSubmit,
  isSubmitting: state.isSubmitting,
  cantSubmit: !state.canSubmit,
});

const firstNameSelector = (state) => state.values.firstName;

const NameForm = createForm({
  defaultValues: { firstName: '' },
});

<template>
  <NameForm as |tanstackForm|>
    <Subscribe @form={{tanstackForm}} @selector={{firstNameSelector}} as |firstName|>
      <p>First name: {{firstName}}</p>
    </Subscribe>

    <Subscribe @form={{tanstackForm}} @selector={{submitButtonState}} as |slice|>
      <button type="submit" disabled={{slice.cantSubmit}}>
        {{if slice.isSubmitting "..." "Submit"}}
      </button>
    </Subscribe>
  </NameForm>
</template>
```

> If you need `useStore` (an autotracked box that exposes the selected slice on `.current`), call it inside a child Glimmer component that receives the form as `@form` and constructs the box in its constructor. `useStore` exists for cases where you want to read state from JavaScript (e.g. a `@cached` getter) rather than from a template.

> A note on boolean negation: in Ember strict-mode templates you cannot write `{{!state.canSubmit}}` inline. Either pre-compute the negated flag inside the selector (as above), expose it from a getter, or import a `not` helper. The selector approach keeps the work co-located with the rest of the slice.

## Array Fields

Array fields allow you to manage a list of values within a form, such as a list of hobbies. You can create an array field by passing `@mode="array"` to `<Field>`.

When working with array fields, you can use the field's `pushValue`, `removeValue`, `swapValues`, and `moveValue` methods to add, remove, swap, and move a value from one index to another within the array, respectively. Additional helper methods such as `insertValue`, `replaceValue`, and `clearValues` are also available for inserting, replacing, and clearing array values.

Example:

```gjs
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);

const nameAt = (i) => `hobbies[${i}].name`;
const descriptionAt = (i) => `hobbies[${i}].description`;

const addHobby = (hobbiesField) =>
  hobbiesField.pushValue({ name: '', description: '', yearsOfExperience: 0 });

const HobbiesForm = createForm({
  defaultValues: { hobbies: [] },
});

<template>
  <HobbiesForm as |tanstackForm|>
    <tanstackForm.Field @name="hobbies" @mode="array" as |hobbiesField|>
      <div>
        Hobbies
        <div>
          {{#each hobbiesField.state.value as |_ i|}}
            <div>
              <tanstackForm.Field @name={{nameAt i}} as |field|>
                <div>
                  <label for={{field.name}}>Name:</label>
                  <input
                    id={{field.name}}
                    name={{field.name}}
                    value={{field.state.value}}
                    {{on "blur" field.handleBlur}}
                    {{on "change" (fn handleInput field)}}
                  />
                  <button type="button" {{on "click" (fn hobbiesField.removeValue i)}}>
                    X
                  </button>
                </div>
              </tanstackForm.Field>
              <tanstackForm.Field @name={{descriptionAt i}} as |field|>
                <div>
                  <label for={{field.name}}>Description:</label>
                  <input
                    id={{field.name}}
                    name={{field.name}}
                    value={{field.state.value}}
                    {{on "blur" field.handleBlur}}
                    {{on "change" (fn handleInput field)}}
                  />
                </div>
              </tanstackForm.Field>
            </div>
          {{else}}
            No hobbies found.
          {{/each}}
        </div>
        <button type="button" {{on "click" (fn addHobby hobbiesField)}}>
          Add hobby
        </button>
      </div>
    </tanstackForm.Field>
  </HobbiesForm>
</template>
```

These are the basic concepts and terminology used in the `@tanstack/ember-form` library. Understanding these concepts will help you work more effectively with the library and create complex forms with ease.
