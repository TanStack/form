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
    as |f|
  >
    <form {{on "submit" (onSubmitFor f)}}>
      <f.Field @name="firstName" as |field|>
        <input
          name={{field.name}}
          value={{field.state.value}}
          {{on "blur" field.handleBlur}}
          {{on "input" (fn handleInput field)}}
        />
      </f.Field>
      <f.Field @name="lastName" as |field|>
        <input
          name={{field.name}}
          value={{field.state.value}}
          {{on "blur" field.handleBlur}}
          {{on "input" (fn handleInput field)}}
        />
      </f.Field>
      <button type="submit">Submit</button>
    </form>
  </PersonForm>
</template>
```

```gjs
// page.gts
import Component from '@glimmer/component';
import { getPromiseState } from 'reactiveweb/get-promise-state';
import { PersonForm } from './person-form.gts';

async function loadPerson() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { firstName: 'FirstName', lastName: 'LastName' };
}

export default class PersonPage extends Component {
  request = loadPerson();

  get person() {
    return getPromiseState(this.request);
  }

  <template>
    {{#if this.person.isLoading}}
      <p>Loading...</p>
    {{else if this.person.error}}
      <p>The person did not load.</p>
    {{else}}
      <PersonForm @defaultValues={{this.person.resolved}} />
    {{/if}}
  </template>
}
```

The page shows the loading text until the promise resolves. `<PersonForm>` renders only after that, so the form starts with the fetched values.

> The example uses `getPromiseState` from [`reactiveweb`](https://github.com/universal-ember/reactiveweb). It derives `isLoading`, `error`, and `resolved` from a promise, so the component has no loading flags of its own. Any other source of data works the same way: a route model, ember-resources, or warp-drive. Do not render the form until the data is ready.

## Updating defaults after the form is mounted

To render the form immediately, pass the loaded values as `@defaultValues` when they arrive. The form applies changed args by itself.

```gjs
<PersonForm @defaultValues={{this.person.resolved}} />
```

New default values do not replace the input of a user. A field that the user touched keeps its value.
