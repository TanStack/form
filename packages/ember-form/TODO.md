# TODO for `@tanstack/ember-form`

Open work for the Ember adapter, with the reason for each item.

The links to TanStack Table point at the `beta` branch at commit `9e523bc7`. That branch has the Ember table adapter from [TanStack/table#6397](https://github.com/TanStack/table/pull/6397).

## 1. Ask form-core for a reactivity option

This item removes the most code. It needs a change in form-core first.

table-core lets an adapter supply the atoms that hold the state. The Ember table adapter gives it `@tracked` and `@cached`, so the state is in Ember and a template reads it with no subscription:

```ts
// @tanstack/ember-table, src/reactivity.ts
export function emberReactivity(): TableReactivityBindings {
  return {
    schedule: (fn) => queueMicrotask(() => fn()),
    batch: (fn) => fn(),
    untrack,
    // @cached
    createReadonlyAtom: <T>(fn: () => T) => computed(fn),
    // @tracked
    createWritableAtom: <T>(value: T, options?: TableAtomOptions<T>) =>
      signal(value, options),
  }
}
```

form-core has no such option. It calls `createStore` from `@tanstack/store` directly:

```ts
// @tanstack/form-core, src/FieldApi.ts
this.store = createStore((prevVal) => {
  // Temp hack to subscribe to form.store
  this.form.store.get()
  // ...
})
```

Autotracking cannot observe that store, so this adapter subscribes to it and keeps one tag per state key. Each store change costs one microtask and one loop over the keys that a template read.

With a reactivity option in form-core, these go away:

- `src/-private/track-store.ts`
- `src/-private/tracked-api.ts`
- the microtask between a store change and the render

`src/-private/live-options.ts` stays. It depends on item 2, not on this item.

Steps:

1. Open an issue on TanStack/form that proposes the option. Use the table-core bindings as the model.
2. After form-core has the option, port `Signal` and `ComputedSignal` from the table adapter.
3. Delete the two private files, and keep `tests/integration/render-passes-test.gts` as the guard.

Links:

- [ember-table `reactivity.ts`](https://github.com/TanStack/table/blob/9e523bc7352bcb5f7beeb4960ded4e8b149826ef/packages/ember-table/src/reactivity.ts)
- [ember-table `signal.ts`](https://github.com/TanStack/table/blob/9e523bc7352bcb5f7beeb4960ded4e8b149826ef/packages/ember-table/src/signal.ts)
- [table-core `coreReactivityFeature.types.ts`](https://github.com/TanStack/table/blob/9e523bc7352bcb5f7beeb4960ded4e8b149826ef/packages/table-core/src/core/reactivity/coreReactivityFeature.types.ts)
- [form-core `FieldApi.ts`, the `createStore` call](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/form-core/src/FieldApi.ts#L749)
- [form-core `FormApi.ts`, the base store](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/form-core/src/FormApi.ts#L1161)

## 2. Remove the `update` calls from the getters

`Field` does not push its options. form-core gets one object with live getters, and reads the current args when it needs them:

```ts
// src/components/field.gts
new FieldApi(liveOptions(args, { form, name }))
```

Two `update` calls remain. Each one is a write inside a getter, and each one needs a change in form-core before it can go.

`Field` calls `update` for a changed `@defaultValue`. form-core copies the default value into the store, so a changed option needs a write:

```ts
// @tanstack/form-core, src/FieldApi.ts
if (!this.state.meta.isTouched && this.options.defaultValue !== undefined) {
  const formField = this.form.getFieldValue(this.name)
  if (!evaluate(formField, opts.defaultValue)) {
    this.form.setFieldValue(this.name, opts.defaultValue as never, {
```

The form calls `update` for each changed arg. Live options do not work there, for two reasons.

`update` compares the default values of two option objects. One live object always gives the same value for the two:

```ts
// @tanstack/form-core, src/FormApi.ts
const oldOptions = this.options
this.options = options

const shouldUpdateValues =
  options.defaultValues &&
  !evaluate(options.defaultValues, oldOptions.defaultValues) &&
  !this.state.isTouched
```

`reset` replaces the options with a copy. A copy of live getters is a set of fixed values:

```ts
// @tanstack/form-core, src/FormApi.ts
if (values && !opts?.keepDefaultValues) {
  this.options = {
    ...this.options,
    defaultValues: values,
  }
}
```

Changes to ask form-core for:

1. Derive the value of an untouched field from the default value. Do not copy it into the store.
2. Change `defaultValues` in `reset` with an assignment to that one key, with no copy of the options.

The table adapter is the model for the form. It takes the options as a function, and table-core reads them when it needs them:

```ts
// @tanstack/ember-table
table = useTable(this, () => ({ columns, data: this.data }))
```

Links:

- [ember-table `use-table.ts`](https://github.com/TanStack/table/blob/9e523bc7352bcb5f7beeb4960ded4e8b149826ef/packages/ember-table/src/use-table.ts)
- [form-core `FieldApi.ts`, `update`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/form-core/src/FieldApi.ts#L990)
- [form-core `FormApi.ts`, `update`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/form-core/src/FormApi.ts#L1732)
- [form-core `FormApi.ts`, `reset`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/form-core/src/FormApi.ts#L1810)

## 3. Keep these three rules when the code changes

The table adapter does each of these differently. Do not copy that part.

Use public Ember API only. The table adapter imports from a private package:

```ts
// @tanstack/ember-table. Do not do this here.
import { untrack } from '@glimmer/validator'
```

This adapter gets the same result with an object that inherits from the form-core object. form-core binds its methods to the original object, so its reads stay out of autotracking:

```ts
// src/-private/tracked-api.ts
const tracked = Object.create(api, {
  state: { value: trackStore(api.store, parent), enumerable: true },
})
```

Do not change the form-core object. The table adapter redefines `table.options` and replaces `table.store`.

Do not use a Proxy for the state. form-core creates every state key up front, so one getter per key is enough.

## 4. `Subscribe` does not follow a changed `@form`

`Subscribe` reads `@form` one time, in a field initializer:

```gts
// src/components/subscribe.gts
#state = hasTrackedState(this.form)
  ? this.form.state
  : trackStore(this.form.store, this);
```

If `@form` changes to a different form, the component keeps the state of the first form. `Field` handles the same case correctly, because it mounts a new `FieldApi`.

Fix: read `this.form.state` in the `selected` getter for a form from `createForm`. Add a test in `tests/integration/subscribe-test.gts` that swaps `@form`.

## 5. Port the APIs that the other adapters have

Not in this package yet:

- `FormGroup`
- `createFormCreator`, `AppForm`, and `AppField`
- a field API for JavaScript, such as `useField` in Vue and `createField` in Solid

The form composition guide shows how to write the wrapper components by hand until then.

This package has only the `Field` component. A class cannot own a field without a template.

Links:

- [svelte-form `FormGroup.svelte`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/svelte-form/src/FormGroup.svelte)
- [svelte-form `createFormCreator.svelte.ts`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/svelte-form/src/createFormCreator.svelte.ts)
- [vue-form `useField.tsx`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/vue-form/src/useField.tsx#L189)
- [solid-form `createField.tsx`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/solid-form/src/createField.tsx#L218)
- [The Ember form composition guide](../../docs/framework/ember/guides/form-composition.md)

## 6. Release setup

The maintainers must choose the version line for the first release. After that:

1. Add a changeset for `@tanstack/ember-form`.
2. If the package joins the main version line, add it to the first `fixed` group:

```jsonc
// .changeset/config.json
"fixed": [
  [
    "@tanstack/form-core",
    "@tanstack/react-form",
    // ...
    "@tanstack/svelte-form",
    "@tanstack/ember-form"
  ]
]
```

3. Set `version` in `package.json` to match. It is `0.1.0` now, and form-core is `1.33.5`.

## 7. An array field renders again for each change in a child field

form-core replaces the array each time a child field changes. This adapter tracks `value`, so a keystroke in `people[0].name` invalidates every reader of the `people` field:

```gjs
<tanstackForm.Field @name="people" @mode="array" as |field|>
  {{! This loop compares every row on each keystroke in a child field. }}
  {{#each field.state.value key="@index" as |_ index|}}
    ...
  {{/each}}
</tanstackForm.Field>
```

`key="@index"` keeps the rows, so no DOM changes. The cost is the comparison.

form-core has a counter for this case. It changes only when a row is added, removed, or moved. The other adapters track the counter and not the value:

```ts
// @tanstack/solid-form, src/createField.tsx
const reactiveStateValue = useSelector(fieldApi.store, (state) =>
  mode === 'array' ? state.meta._arrayVersion || 0 : state.value,
)
```

Fix: for a field with `@mode="array"`, invalidate the `value` key in `src/-private/track-store.ts` only when `meta._arrayVersion` changes. Add a test in `tests/integration/render-passes-test.gts` that types in a child field and reads the array field.

After the fix, a template that reads a child property through the array field does not update. Read it through the child field. The other adapters have the same rule.

Links:

- [solid-form `createField.tsx`, the selectors](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/solid-form/src/createField.tsx#L171)
- [form-core `metaHelper.ts`, `bumpArrayVersion`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/form-core/src/metaHelper.ts#L56)
- [TanStack/form#1961](https://github.com/TanStack/form/issues/1961)
- [TanStack/form#1925](https://github.com/TanStack/form/issues/1925)

## 8. `meta` is one tracked key

`field.state` has two tracked keys, `value` and `meta`. form-core replaces the `meta` object on each change, so a change in one part invalidates every reader of `meta`:

```gjs
{{! This reads isTouched, but it also renders again when isValidating changes. }}
{{#if field.state.meta.isTouched}}
  ...
{{/if}}
```

The other adapters track six parts of `meta`, each alone:

```ts
// @tanstack/solid-form, src/createField.tsx
const reactiveMetaIsTouched = useSelector(
  fieldApi.store,
  (state) => state.meta.isTouched,
)
// ...and the same for isBlurred, isDirty, errorMap, errorSourceMap, isValidating
```

Fix: let `trackStore` return a second view for `meta`, with one tag per key of `meta`. Keep one subscription per field. The other adapters use seven.

Do this after item 7, because the two change the same function.

## 9. The form id is different on the server and the client

This adapter passes no `formId`, so form-core makes a random one:

```ts
// @tanstack/form-core, src/FormApi.ts
this._formId = opts?.formId ?? uuid()
```

With a server render, `<form id={{tanstackForm.formId}}>` gets one id on the server and a different id on the client.

Vue and Solid pass an id from the framework, which is the same on the two sides:

```ts
// @tanstack/solid-form, src/createForm.tsx
const fallbackFormId = createUniqueId()
// ...
new FormApi({ ...options, formId: options?.formId ?? fallbackFormId })
```

Ember has no public API that gives such an id. Until it has one, an app with a server render must pass the id:

```gjs
<SignupForm @formId="signup" as |tanstackForm|>
```

Steps:

1. Add this workaround to the Ember docs.
2. Find out if Ember can supply an id that survives rehydration. If it can, use it as the default in `src/create-form.gts`.

Links:

- [solid-form `createForm.tsx`, the id](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/solid-form/src/createForm.tsx#L244)
- [vue-form `useFormId.ts`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/vue-form/src/useFormId.ts)
- [form-core `FormApi.ts`, the default id](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/form-core/src/FormApi.ts#L1095)
