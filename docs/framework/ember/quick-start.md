---
id: quick-start
title: Quick Start
---

The bare minimum to get started with TanStack Form is to create a form and add a field. Keep in mind that this example does not include any validation or error handling... yet.

```gjs
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);

const onSubmitFor = (form) => (event) => {
  event.preventDefault();
  event.stopPropagation();
  form.handleSubmit();
};

const handleSubmit = async ({ value }) => {
  // Do something with form data
  console.log(value);
};

const SimpleFormExample = createForm({
  defaultValues: {
    fullName: '',
  },
});

<template>
  <div>
    <h1>Simple Form Example</h1>
    <SimpleFormExample @onSubmit={{handleSubmit}} as |f|>
      <form {{on "submit" (onSubmitFor f)}}>
        <div>
          <f.Field @name="fullName" as |field|>
            <input
              name={{field.name}}
              value={{field.state.value}}
              {{on "blur" field.handleBlur}}
              {{on "input" (fn handleInput field)}}
            />
          </f.Field>
        </div>
        <button type="submit">Submit</button>
      </form>
    </SimpleFormExample>
  </div>
</template>
```

A few things worth pointing out:

- `createForm({ ... })` is called at module scope. It returns a Glimmer component that you invoke in your template; the form's lifecycle (mount/unmount and store subscriptions) is tied to that invocation. The same `createForm` result can be invoked multiple times — each invocation is its own form instance.
- Anything shared across every instance (such as `defaultValues` or validators that don't depend on per-instance state) goes into the `createForm` call. Anything per-instance — most notably `onSubmit`, which usually closes over component state — is passed as an arg on the invocation: `<SimpleFormExample @onSubmit={{handleSubmit}}>`.
- The invocation yields a block param (`f` in the example above). Use it to render fields (`<f.Field>`) or to pass to `<Subscribe>`. Name this block param `tanstackForm` by default; a block param named `form` would shadow the HTML `<form>` element (in Glimmer strict mode `<form>` then resolves to the lexical binding and Glimmer tries to render the form object as a component). In examples that include a literal `<form>` element we use the short alias `f` instead, which keeps the example tight and signals the shadowing concern.
- `onSubmitFor` is a small module-level helper that produces a `submit` handler for a given form. It's a convenient way to keep `event.preventDefault()` plumbing out of every template without re-introducing class methods.
- Common template built-ins like `on`, `fn`, `hash`, and `if` are compiled into scope by ember-source's template build transforms (ember-source 7+), so you don't need to import them.
- `handleInput` is defined at module scope rather than as a method, so we can use the standard `(fn handleInput field)` pattern without binding `this` for every render.

From here, you'll be ready to explore all of the other features of TanStack Form!
