---
id: async-initial-values
title: Async Initial Values
---

Let's say that you want to fetch some data from an API and use it as the initial value of a form.

While this problem sounds simple on the surface, there are hidden complexities you might not have thought of thus far.

For example, you might want to show a loading spinner while the data is being fetched, or you might want to handle errors gracefully. Likewise, you could also find yourself looking for a way to cache the data so that you don't have to fetch it every time the form is rendered.

While we could implement many of these features from scratch, it would end up looking a lot like another project we maintain: [TanStack Query](https://tanstack.com/query).

As such, this guide shows you how you can mix-n-match TanStack Form with a data-loading utility (such as [`ember-resources`](https://github.com/NullVoxPopuli/ember-resources), [warp-drive](https://github.com/emberjs/data), or your own routing layer) to achieve the desired behavior.

## Basic Usage

The general shape of the solution is:

1. Load the data outside of the form (in a route, a resource, or a parent component).
2. Render the form only once the data is available, passing the resolved values into the invocation as `@defaultValues`.

Because `createForm` is called at module scope, the component it returns is constructed every time it's invoked in a template. The simplest pattern is to render the form invocation inside an `{{#if}}` that gates on the loading state and pass the resolved data as `@defaultValues`. The arg-level `@defaultValues` is merged with anything baked into `createForm`, so per-instance overrides are straightforward.

```gjs
// person-form.gts
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

export const PersonForm = createForm({
  // Sensible fallbacks; the caller can override via @defaultValues
  defaultValues: {
    firstName: '',
    lastName: '',
  },
});

<template>
  <PersonForm
    @defaultValues={{@initial}}
    @onSubmit={{handleSubmit}}
    as |Form|
  >
    <form {{on "submit" (onSubmitFor Form)}}>
      <Form.Field @name="firstName" as |field|>
        <input
          name={{field.name}}
          value={{field.state.value}}
          {{on "blur" field.handleBlur}}
          {{on "input" (fn handleInput field)}}
        />
      </Form.Field>
      <Form.Field @name="lastName" as |field|>
        <input
          name={{field.name}}
          value={{field.state.value}}
          {{on "blur" field.handleBlur}}
          {{on "input" (fn handleInput field)}}
        />
      </Form.Field>
      <button type="submit">Submit</button>
    </form>
  </PersonForm>
</template>
```

```gjs
// page.gts
import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';
import { PersonForm } from './person-form.gts';

export default class PersonPage extends Component {
  request = trackedFunction(this, async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { firstName: 'FirstName', lastName: 'LastName' };
  });

  <template>
    {{#if this.request.isPending}}
      <p>Loading...</p>
    {{else if this.request.value}}
      <PersonForm @defaultValues={{this.request.value}} />
    {{/if}}
  </template>
}
```

This will show a loading spinner until the data is fetched, and then it will render the form with the fetched data as the initial values. Because `<PersonForm>` is only invoked once `request.value` is defined, the form is constructed with the resolved values on mount.

> The example above uses [`reactiveweb`](https://github.com/universal-ember/reactiveweb)'s `trackedFunction`, but the pattern is the same with any data-loading primitive — Ember's route model, ember-resources, `Resource` from `@warp-drive/*`, or even a hand-rolled async getter. The key invariant is: don't invoke the form component until the data is ready.

## Wrapping the form in a component that consumes the resolved data

If you'd rather encapsulate the form invocation alongside other component-local state, write a Glimmer component that takes the resolved data as an arg and renders the form internally:

```gjs
// person-form-loader.gts
import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';
import { PersonForm } from './person-form.gts';

export default class PersonFormLoader extends Component {
  request = trackedFunction(this, async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { firstName: 'FirstName', lastName: 'LastName' };
  });

  <template>
    {{#if this.request.isPending}}
      <p>Loading...</p>
    {{else if this.request.value}}
      <PersonForm @defaultValues={{this.request.value}} />
    {{/if}}
  </template>
}
```

## Updating defaults after the form is mounted

If you'd rather invoke the form immediately and patch values in once data arrives, you can call `form.update({ defaultValues: ... })` (or `form.reset(values)`) from inside a child component that receives the form as `@form` (e.g. via a `<Subscribe>` selector or a `{{didUpdate}}` modifier triggered when the loaded data changes). Be aware that updating `defaultValues` after fields have been touched will not overwrite user input — that is by design.
