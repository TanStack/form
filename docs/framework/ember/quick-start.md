---
id: quick-start
title: Quick Start
---

The bare minimum to get started with TanStack Form is to create a form and add a field. Keep in mind that this example does not include any validation or error handling... yet.

```gjs
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);

export default class SimpleFormExample extends Component {
  form = createForm(this, {
    defaultValues: {
      fullName: '',
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
    <div>
      <h1>Simple Form Example</h1>
      <form {{on "submit" this.submit}}>
        <div>
          <this.form.Field @name="fullName" as |field|>
            <input
              name={{field.name}}
              value={{field.state.value}}
              {{on "blur" field.handleBlur}}
              {{on "input" (fn handleInput field)}}
            />
          </this.form.Field>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
}
```

A few things worth pointing out:

- `createForm(this, { ... })` is called from a class field initializer. The first argument is any destroyable — typically the component instance. The form's lifecycle (mount/unmount and store subscriptions) is tied to that destroyable.
- `this.form.Field` is a closure-bound `<Field>` component that already knows about this form. You can also import `Field` from `@tanstack/ember-form` and pass `@form={{this.form}}` explicitly if you prefer.
- Strict-mode templates require explicit imports for every helper, modifier, and component used — including `on` from `@ember/modifier` and `fn` from `@ember/helper`.
- `handleInput` is defined at module scope rather than as a method, so we can use the standard `(fn handleInput field)` pattern without binding `this` for every render.

From here, you'll be ready to explore all of the other features of TanStack Form!
