# @tanstack/ember-form

Powerful, type-safe forms for Ember, built on `@tanstack/form-core`.

## Compatibility

- ember-source 7.1 or later
- gjs and gts only

From ember-source 7.1, templates can use `on`, `fn`, and `hash` without an import.

## Installation

```sh
pnpm add @tanstack/ember-form
```

## Usage

`createForm` is a module-scope factory. Each call returns a Glimmer component whose args override the defaults you passed in.

```gjs
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => {
  field.handleChange(event.target.value);
};

const tooShort = ({ value }) => (value.length < 3 ? 'Too short' : undefined);

const pickSubmit = (state) => ({
  cantSubmit: !state.canSubmit,
  isSubmitting: state.isSubmitting,
});

const onSubmitFor = (form) => (event) => {
  event.preventDefault();
  form.handleSubmit();
};

const SignupForm = createForm({
  defaultValues: { firstName: '', lastName: '' },
});

export default class Signup extends Component {
  onSubmit = async ({ value }) => {
    console.log('submit', value);
  };

  <template>
    <SignupForm @onSubmit={{this.onSubmit}} as |f|>
      <form {{on "submit" (onSubmitFor f)}}>
        <f.Field
          @name="firstName"
          @validators={{hash onChange=tooShort}}
          as |field|
        >
          <label>
            First name
            <input
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
          </label>
          {{#each field.state.meta.errors as |error|}}
            <em>{{error}}</em>
          {{/each}}
        </f.Field>

        <f.Subscribe @selector={{pickSubmit}} as |slice|>
          <button type="submit" disabled={{slice.cantSubmit}}>
            {{if slice.isSubmitting "Submitting…" "Submit"}}
          </button>
        </f.Subscribe>
      </form>
    </SignupForm>
  </template>
}
```

### API

`createForm(baseOptions)` returns a component. Call it in module scope. Each arg on the component, for example `@onSubmit`, overrides the same key in `baseOptions`.

The component yields the `FormApi` with these additions:

- `Field` renders one field. It takes `@name` and the field options, for example `@validators` and `@defaultValue`.
- `Subscribe` yields form state. It takes an optional `@selector`.
- `useSelector(selector?)` reads form state in JavaScript. It returns an object with an autotracked `current` property.

`Field` and `Subscribe` are also exports. The exports take the form as `@form`.

> In a strict-mode template, a name in scope hides the HTML element of the same name. Do not name the component or the yielded form `form`. The examples use `tanstackForm`, or `f` when the markup contains a `<form>` element.

Everything else is re-exported from `@tanstack/form-core` (validators, types, helpers).

For the full guide — quick start, basic concepts, validation, dynamic validation, async initial values, arrays, linked fields, and form composition — see the [Ember docs in the TanStack/form repo](https://github.com/TanStack/form/tree/main/docs/framework/ember).

## License

MIT — see the [root LICENSE](../../LICENSE).
