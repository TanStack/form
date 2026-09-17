# @tanstack/ember-form

Powerful, type-safe forms for Ember, built on `@tanstack/form-core`.

## Compatibility

- ember-source 6.8 or later
- gjs and gts only

From ember-source 7.1, templates can use `on`, `fn`, and `hash` without an import, and the examples rely on that. Before 7.1, import `on` from `@ember/modifier`, and import `fn` and `hash` from `@ember/helper`.

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

## Development

Ember projects test in a browser, because end users do not run node or a fake DOM. The tests render real components in Chrome and assert on the real DOM. This package has no jsdom tests.

Build `@tanstack/form-core` one time, then run the checks from this directory:

```sh
pnpm --filter @tanstack/form-core build

pnpm test:browser      # all tests, in headless Chrome
pnpm test:browser:dev  # a dev server, to run and debug the tests in your own browser
pnpm test:types        # source, tests, and demo app
pnpm test:eslint
```

`tests/types/templates.gts` holds the type tests. Each `@glint-expect-error` comment marks a template that must not type-check, and `pnpm test:types` fails if one of them does.

The tests import `on`, `fn`, and `hash`, because they must also compile on ember-source 6.8. CI runs them two times: on the installed version, and on 6.8.

In CI, the browser tests run in their own job on the GitHub runner, because the Nx agents that run the other targets have no browser.

## License

MIT — see the [root LICENSE](../../LICENSE).
