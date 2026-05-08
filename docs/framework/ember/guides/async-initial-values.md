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
2. Render the form only once the data is available, passing the resolved values into `defaultValues`.

Because `createForm` runs at component construction time, the simplest pattern is to render the form-bearing component inside an `{{#if}}` that gates on the loading state. That way, by the time `createForm` runs, `defaultValues` is already populated.

```gjs
// person-form.gts
import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);

export default class PersonForm extends Component {
  // Args: { firstName: string; lastName: string }
  form = createForm(this, {
    defaultValues: {
      firstName: this.args.firstName ?? '',
      lastName: this.args.lastName ?? '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });

  submit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  };

  <template>
    <form {{on "submit" this.submit}}>
      <this.form.Field @name="firstName" as |field|>
        <input
          name={{field.name}}
          value={{field.state.value}}
          {{on "blur" field.handleBlur}}
          {{on "input" (fn handleInput field)}}
        />
      </this.form.Field>
      <this.form.Field @name="lastName" as |field|>
        <input
          name={{field.name}}
          value={{field.state.value}}
          {{on "blur" field.handleBlur}}
          {{on "input" (fn handleInput field)}}
        />
      </this.form.Field>
      <button type="submit">Submit</button>
    </form>
  </template>
}
```

```gjs
// page.gts
import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';
import PersonForm from './person-form.gts';

export default class PersonPage extends Component {
  request = trackedFunction(this, async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { firstName: 'FirstName', lastName: 'LastName' };
  });

  <template>
    {{#if this.request.isPending}}
      <p>Loading...</p>
    {{else if this.request.value}}
      <PersonForm
        @firstName={{this.request.value.firstName}}
        @lastName={{this.request.value.lastName}}
      />
    {{/if}}
  </template>
}
```

This will show a loading spinner until the data is fetched, and then it will render the form with the fetched data as the initial values. Because `<PersonForm>` is only constructed once `request.value` is defined, `createForm` sees the resolved values on mount.

> The example above uses [`reactiveweb`](https://github.com/universal-ember/reactiveweb)'s `trackedFunction`, but the pattern is the same with any data-loading primitive — Ember's route model, ember-resources, `Resource` from `@warp-drive/*`, or even a hand-rolled async getter. The key invariant is: don't construct the form until the data is ready.

## Updating defaults after the form is mounted

If you'd rather render the form immediately and patch values in once data arrives, you can call `form.update({ defaultValues: ... })` (or `form.reset(values)`) from a `@cached` getter or an effect when the loaded data changes. Be aware that updating `defaultValues` after fields have been touched will not overwrite user input — that is by design.
