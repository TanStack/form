---
id: form-composition
title: Form Composition
---

A common criticism of TanStack Form is its verbosity out-of-the-box. While this _can_ be useful for educational purposes — helping enforce understanding of our APIs — it's not ideal in production use cases.

As a result, while `<Field>` enables the most powerful and flexible usage of TanStack Form, we provide patterns that wrap it and make your application code less verbose.

> The `createFormCreator` / `createAppForm` / `useFieldContext` family of helpers found in `@tanstack/svelte-form` and `@tanstack/react-form` is not yet shipped in `@tanstack/ember-form`. The strategies below show how to achieve the same ergonomic wins using vanilla Glimmer components, plain `formOptions`, and the `<Field>` / `<Subscribe>` primitives. When the App-form helpers land, this guide will be expanded to cover them.

## Sharing form options with `formOptions`

You can create options for your form so that they can be shared between multiple forms by using the `formOptions` function. These options are framework-agnostic and live in `@tanstack/form-core` (re-exported from `@tanstack/ember-form`).

```ts
// shared-form.ts
import { formOptions } from '@tanstack/ember-form';

export const peopleFormOpts = formOptions({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
});
```

```gjs
// app.gts
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';
import { peopleFormOpts } from './shared-form.ts';

export default class App extends Component {
  form = createForm(this, {
    ...peopleFormOpts,
  });

  <template>
    <this.form.Field @name="firstName" as |field|>
      {{!-- ... --}}
    </this.form.Field>
  </template>
}
```

## Pre-bound Field components

The simplest way to remove boilerplate is to write small wrapper components that take a `field` and render a labeled input. Define them once, use them everywhere.

```gjs
// text-field.gts
import Component from '@glimmer/component';

const handleInput = (field, event) =>
  field.handleChange(event.target.value);

interface TextFieldSignature {
  Args: {
    /** The field yielded from `<Field>`. */
    field: { name: string; state: { value: string }; handleBlur: () => void; handleChange: (value: string) => void };
    label: string;
  };
}

export default class TextField extends Component<TextFieldSignature> {
  <template>
    <label>
      <div>{{@label}}</div>
      <input
        name={{@field.name}}
        value={{@field.state.value}}
        {{on "blur" @field.handleBlur}}
        {{on "input" (fn handleInput @field)}}
      />
    </label>
  </template>
}
```

You're then able to reuse this component anywhere you have a `field`:

```gjs
// app.gts
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';
import TextField from './text-field.gts';

export default class App extends Component {
  form = createForm(this, {
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  });

  <template>
    <this.form.Field @name="firstName" as |field|>
      <TextField @field={{field}} @label="First Name" />
    </this.form.Field>
    <this.form.Field @name="lastName" as |field|>
      <TextField @field={{field}} @label="Last Name" />
    </this.form.Field>
  </template>
}
```

This not only allows you to reuse the UI of your shared component, but retains the type-safety you'd expect from TanStack Form: typo `@name` and you'll get a TypeScript error.

## Pre-bound Form components

While the `TextField` pattern solves field-level boilerplate, it doesn't solve _form_-level boilerplate. In particular, being able to share an instance of `<Subscribe>` for, say, a reactive form submission button is a common usecase.

Just like with field components, we can encapsulate this in a plain Glimmer component that takes the form as an arg:

```gjs
// subscribe-button.gts
import Component from '@glimmer/component';
import { Subscribe } from '@tanstack/ember-form';
import type { AnyFormApi } from '@tanstack/ember-form';

interface SubscribeButtonSignature {
  Args: {
    form: AnyFormApi;
    label: string;
  };
}

const isSubmittingSelector = (state) => state.isSubmitting;

export default class SubscribeButton extends Component<SubscribeButtonSignature> {
  <template>
    <Subscribe @form={{@form}} @selector={{isSubmittingSelector}} as |isSubmitting|>
      <button type="submit" disabled={{isSubmitting}}>
        {{@label}}
      </button>
    </Subscribe>
  </template>
}
```

```gjs
// app.gts
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';
import SubscribeButton from './subscribe-button.gts';

export default class App extends Component {
  form = createForm(this, {
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  });

  <template>
    {{!-- ...fields... --}}
    <SubscribeButton @form={{this.form}} @label="Submit" />
  </template>
}
```

## Breaking big forms into smaller pieces

Sometimes forms get very large; it's just how it goes sometimes. While TanStack Form supports large forms well, it's never fun to work with hundreds-or-thousands-of-lines-long files.

To solve this, you can break forms into smaller Glimmer components that accept the form as an arg.

```ts
// shared-form.ts
import { formOptions } from '@tanstack/ember-form';

export const peopleFormOpts = formOptions({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
});
```

```gjs
// child-form.gts
import Component from '@glimmer/component';
import type { EmberFormExtendedApi } from '@tanstack/ember-form';
import { peopleFormOpts } from './shared-form.ts';
import TextField from './text-field.gts';
import SubscribeButton from './subscribe-button.gts';

type PeopleForm = EmberFormExtendedApi<
  typeof peopleFormOpts.defaultValues,
  // The remaining type params are validator types; `undefined`s are fine
  // when no validators are configured at the form level.
  undefined, undefined, undefined, undefined, undefined,
  undefined, undefined, undefined, undefined, undefined, unknown
>;

interface ChildFormSignature {
  Args: {
    form: PeopleForm;
    title?: string;
  };
}

export default class ChildForm extends Component<ChildFormSignature> {
  get title() {
    return this.args.title ?? 'Child Form';
  }

  <template>
    <div>
      <p>{{this.title}}</p>
      <@form.Field @name="firstName" as |field|>
        <TextField @field={{field}} @label="First Name" />
      </@form.Field>
      <SubscribeButton @form={{@form}} @label="Submit" />
    </div>
  </template>
}
```

```gjs
// app.gts
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';
import { peopleFormOpts } from './shared-form.ts';
import ChildForm from './child-form.gts';

export default class App extends Component {
  form = createForm(this, {
    ...peopleFormOpts,
  });

  <template>
    <ChildForm @form={{this.form}} @title="Testing" />
  </template>
}
```

> The `EmberFormExtendedApi` generic chain is verbose, but the type can be derived from `ReturnType<typeof createForm<...>>` if you'd rather lean on inference. In practice, most teams type the form arg loosely (`AnyFormApi`) inside reusable subcomponents and rely on the call site to provide type safety.

## Reusing groups of fields in multiple forms

Sometimes, a pair of fields are so closely related that it makes sense to group and reuse them — like the password example from the [linked fields guide](./linked-fields.md). Instead of repeating this logic across multiple forms, you can extract a reusable component that takes the form as an arg.

```gjs
// password-fields.gts
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import type { AnyFormApi } from '@tanstack/ember-form';
import TextField from './text-field.gts';

interface PasswordFields {
  password: string;
  confirm_password: string;
}

interface PasswordFieldsSignature {
  Args: {
    form: AnyFormApi; // Caller is responsible for ensuring the form has the required fields
    title?: string;
  };
}

const onChangeListenTo = ['password'];
const validateConfirm = ({ value, fieldApi }) => {
  if (value !== fieldApi.form.getFieldValue('password')) {
    return 'Passwords do not match';
  }
  return undefined;
};

export default class PasswordFields extends Component<PasswordFieldsSignature> {
  get title() {
    return this.args.title ?? 'Password';
  }

  <template>
    <div>
      <h2>{{this.title}}</h2>
      <@form.Field @name="password" as |field|>
        <TextField @field={{field}} @label="Password" />
      </@form.Field>
      <@form.Field
        @name="confirm_password"
        @validators={{hash
          onChangeListenTo=onChangeListenTo
          onChange=validateConfirm
        }}
        as |field|
      >
        <div>
          <TextField @field={{field}} @label="Confirm Password" />
          {{#each field.state.meta.errors as |error|}}
            <div style="color: red;">{{error}}</div>
          {{/each}}
        </div>
      </@form.Field>
    </div>
  </template>
}
```

We can now use these grouped fields in any form that implements the required fields:

```gjs
// app.gts
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';
import PasswordFields from './password-fields.gts';
import TextField from './text-field.gts';
import SubscribeButton from './subscribe-button.gts';

export default class App extends Component {
  form = createForm(this, {
    defaultValues: {
      name: '',
      age: 0,
      password: '',
      confirm_password: '',
    },
  });

  <template>
    <this.form.Field @name="name" as |field|>
      <TextField @field={{field}} @label="Name" />
    </this.form.Field>
    <PasswordFields @form={{this.form}} @title="Account Password" />
    <SubscribeButton @form={{this.form}} @label="Submit" />
  </template>
}
```

> Unlike form-level components, validators in field groups cannot be strictly typed and could be any value. Ensure that your fields can accept unknown error types.

## Tree-shaking form and field components

While the above examples are great for getting started, they're not ideal for certain use-cases where you might have hundreds of form and field components. In particular, you may not want to include all of your form and field components in the bundle of every file that uses your form.

The good news is that this approach (one component per file, imported where used) tree-shakes naturally: each consuming module only pulls in the wrapper components it actually references. There's no central registry to bloat the bundle. If you do want lazy-loaded components, Ember and Embroider both support dynamic `import()` of `.gjs`/`.gts` files, the same as any other module.

## Putting it all together

Now that we've covered the basics of composing forms, let's put it all together in a single example.

```gjs
// /src/components/text-field.gts
import Component from '@glimmer/component';

const handleInput = (field, event) => field.handleChange(event.target.value);

export default class TextField extends Component {
  <template>
    <label>
      <div>{{@label}}</div>
      <input
        value={{@field.state.value}}
        {{on "input" (fn handleInput @field)}}
      />
    </label>
  </template>
}
```

```gjs
// /src/components/subscribe-button.gts
import Component from '@glimmer/component';
import { Subscribe } from '@tanstack/ember-form';

const isSubmittingSelector = (state) => state.isSubmitting;

export default class SubscribeButton extends Component {
  <template>
    <Subscribe @form={{@form}} @selector={{isSubmittingSelector}} as |isSubmitting|>
      <button type="submit" disabled={{isSubmitting}}>
        {{@label}}
      </button>
    </Subscribe>
  </template>
}
```

```ts
// /src/features/people/shared-form.ts, to be used across `people` features
import { formOptions } from '@tanstack/ember-form';

export const peopleFormOpts = formOptions({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
});
```

```gjs
// /src/features/people/child-form.gts, to be used in the `people` page
import Component from '@glimmer/component';
import TextField from '../../components/text-field.gts';
import SubscribeButton from '../../components/subscribe-button.gts';

export default class ChildForm extends Component {
  get title() {
    return this.args.title ?? 'Child Form';
  }

  <template>
    <div>
      <p>{{this.title}}</p>
      <@form.Field @name="firstName" as |field|>
        <TextField @field={{field}} @label="First Name" />
      </@form.Field>
      <SubscribeButton @form={{@form}} @label="Submit" />
    </div>
  </template>
}
```

```gjs
// /src/features/people/page.gts
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';
import { peopleFormOpts } from './shared-form.ts';
import ChildForm from './child-form.gts';

export default class PeoplePage extends Component {
  form = createForm(this, {
    ...peopleFormOpts,
  });

  <template>
    <ChildForm @form={{this.form}} @title="Testing" />
  </template>
}
```

## API Usage Guidance

Here's a chart from the React/Svelte ecosystem to help you decide what APIs you should be using. The shape of the recommendation is the same in Ember — the App-form layer (`AppField`, `AppForm`, `useFieldContext`) is currently provided by hand in Ember (as wrapper components like `TextField` and `SubscribeButton` above) rather than by `createFormCreator`.

![](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/svelte_form_composability.svg)
