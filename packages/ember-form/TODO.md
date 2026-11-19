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

## 2. Pull the options, do not push them

This item also needs form-core support.

The table adapter takes the options as a function. A `@cached` value wraps the function, and table-core reads the current options when it needs them:

```ts
// @tanstack/ember-table
table = useTable(this, () => ({ columns, data: this.data }))
```

This adapter pushes the options. A `@cached` getter calls `update` each time an arg changes:

```gts
// src/create-form.gts
@cached
get form() {
  this.#api.update(this.#options);

  return this.#form;
}
```

The call is a write inside a getter. form-core documents `update` as free of side effects, but `update` can set a default value, and that is a store write during a render.

If form-core reads its options from a store that an adapter can supply, both `update` calls go away (`src/create-form.gts` and `src/components/field.gts`).

Link:

- [ember-table `use-table.ts`](https://github.com/TanStack/table/blob/9e523bc7352bcb5f7beeb4960ded4e8b149826ef/packages/ember-table/src/use-table.ts)

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

The form composition guide shows how to write the wrapper components by hand until then.

Links:

- [svelte-form `FormGroup.svelte`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/svelte-form/src/FormGroup.svelte)
- [svelte-form `createFormCreator.svelte.ts`](https://github.com/TanStack/form/blob/39ded17a7d37511df835e871bc6c8f566be9ac8b/packages/svelte-form/src/createFormCreator.svelte.ts)
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
