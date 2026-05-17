# @tanstack/ember-form

Powerful, type-safe forms for Ember, built on `@tanstack/form-core`.

## Compatibility

- ember-source 7.1+ (gjs/gts only)

ember-source 7.1's template build transforms compile common keywords (`on`, `fn`, `hash`, `if`, etc.) into template scope, so you don't need to import them from `@ember/helper` or `@ember/modifier`.

## Installation

```sh
pnpm add @tanstack/ember-form
```

## Usage

`createForm` is a module-scope factory. Each call returns a Glimmer component whose args override the defaults you passed in.

```gjs
import Component from '@glimmer/component';
import { createForm, Subscribe } from '@tanstack/ember-form';

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

        <Subscribe @form={{f}} @selector={{pickSubmit}} as |slice|>
          <button type="submit" disabled={{slice.cantSubmit}}>
            {{if slice.isSubmitting "Submitting…" "Submit"}}
          </button>
        </Subscribe>
      </form>
    </SignupForm>
  </template>
}
```

### API

- `createForm(baseOptions)` — Returns a Glimmer component bound to those base options. Call at module scope; the same component can be invoked multiple times. Args on the invocation site (e.g. `@onSubmit`, `@validators`, ...) override the matching `baseOptions` key.
- The block param yields the `FormApi` extended with two helpers:
  - `<theForm>.Field` — A closure-bound `<Field>` so you can write `<tanstackForm.Field @name="...">` without passing `@form`.
  - `<theForm>.useStore(selector?)` — Returns `{ current }` where `current` is autotracked. Useful when reading the slice from JS (e.g. inside a `@cached` getter on a child component that receives the form as an arg). For inline template reads, prefer `<Subscribe>`.
- `<Field @form @name [@validators] [@defaultValue] [@asyncDebounceMs] [@listeners] [@mode]>` — Standalone form-aware field. Same as the closure-bound `.Field` but with `@form` passed explicitly.
- `<Subscribe @form [@selector]>` — Yields the result of `selector(form.store.state)` (or the full state when omitted), reactive across changes.

> **Block-param naming.** In Glimmer strict mode a block param shadows same-named HTML elements. Name the yielded value `tanstackForm`; if your markup also contains an HTML `<form>` element, use a short alias like `f` instead (a block param named `form` would make `<form>` try to render the form object as a component).

Everything else is re-exported from `@tanstack/form-core` (validators, types, helpers).

For the full guide — quick start, basic concepts, validation, dynamic validation, async initial values, arrays, linked fields, and form composition — see the [Ember docs in the TanStack/form repo](https://github.com/TanStack/form/tree/main/docs/framework/ember).

## License

MIT — see the [root LICENSE](../../LICENSE).
