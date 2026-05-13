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

```gjs
import Component from '@glimmer/component';
import { createForm, Field, Subscribe } from '@tanstack/ember-form';

const handleInput = (field, event) => {
  field.handleChange(event.target.value);
};

const tooShort = ({ value }) => (value.length < 3 ? 'Too short' : undefined);

export default class SignupForm extends Component {
  form = createForm(this, {
    defaultValues: { firstName: '', lastName: '' },
    onSubmit: async ({ value }) => {
      console.log('submit', value);
    },
  });

  submit = (event) => {
    event.preventDefault();
    this.form.handleSubmit();
  };

  pickSubmit = (state) => ({
    cantSubmit: !state.canSubmit,
    isSubmitting: state.isSubmitting,
  });

  <template>
    <form {{on "submit" this.submit}}>
      <this.form.Field
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
      </this.form.Field>

      <Subscribe @form={{this.form}} @selector={{this.pickSubmit}} as |slice|>
        <button type="submit" disabled={{slice.cantSubmit}}>
          {{if slice.isSubmitting "Submitting…" "Submit"}}
        </button>
      </Subscribe>
    </form>
  </template>
}
```

`<this.form.Field>` is closure-bound shorthand for `<Field @form={{this.form}}>`. Use whichever is more convenient.

### API

- `createForm(parent, options)` — Returns a `FormApi` extended with `useStore(selector?)` and a closure-bound `Field`. `parent` should be `this` from a `@glimmer/component` (or any destroyable owner). The form is mounted immediately and unmounted when `parent` is destroyed.
- `<Field @form @name [@validators] [@defaultValue] [@asyncDebounceMs] [@listeners] [@mode]>` — Yields a `FieldApi` whose `state` is autotracked. Reads of `field.state.*` in templates rerender on store changes.
- `<this.form.Field @name [...]>` — closure-bound variant of `<Field>` returned from `createForm`. Equivalent to passing `@form={{this.form}}` explicitly.
- `<Subscribe @form [@selector]>` — Yields the result of `selector(form.store.state)` (or the full state when omitted), reactive across changes.
- `form.useStore(selector?)` — Returns `{ current }` where `current` is autotracked. Useful outside of templates (e.g. in `@cached` getters).

Everything else is re-exported from `@tanstack/form-core` (validators, types, helpers).

For the full guide — quick start, basic concepts, validation, dynamic validation, async initial values, arrays, linked fields, and form composition — see the [Ember docs in the TanStack/form repo](https://github.com/TanStack/form/tree/main/docs/framework/ember).

## License

MIT — see the [root LICENSE](../../LICENSE).
