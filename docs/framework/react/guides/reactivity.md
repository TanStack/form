---
id: reactivity
title: Reactivity
---

Tanstack Form doesn't cause re-renders when interacting with the form. So, you might find yourself trying to use a form or field state value without success.

If you would like to access reactive values, you will need to subscribe to them using one of two methods: `useStore` or the `form.Subscribe` component.

Some uses for these subscriptions are rendering up-to-date field values, determining what to render based on a condition, or using field values inside the logic of your component.

> For situations where you want to "react" to triggers, check out the [listener](./listeners.md) API.

## useStore

The `useStore` hook is perfect when you need to access form values within the logic of your component. `useStore` takes two parameters. First, the form store. Second, a selector to specify the piece of the form you wish to subscribe to.

```tsx
const firstName = useStore(form.store, (state) => state.values.firstName)
const errors = useStore(form.store, (state) => state.errorMap)
```

You can access any piece of the form state in the selector.

> Note, that `useStore` will cause a whole component re-render whenever the value subscribed to changes.

While it IS possible to omit the selector, resist the urge as omitting it would result in many unnecessary re-renders whenever any of the form state changes.

## form.Subscribe

The `form.Subscribe` component is best suited when you need to react to something within the UI of your component. For example, showing or hiding UI based on the value of a form field.

```tsx
<form.Subscribe
  selector={(state) => state.values.firstName}
  children={(firstName) => (
    <form.Field>
      {(field) => (
        <input
          name="lastName"
          value={field.state.lastName}
          onChange={field.handleChange}
        />
      )}
    </form.Field>
  )}
/>
```

> The `form.Subscribe` component doesn't trigger component-level re-renders. Anytime the value subscribed to changes, only the `form.Subscribe` component re-renders.

The choice between whether to use `useStore` or `form.Subscribe` mainly boils down to your use case. If you're aiming for direct UI updates based on form state, use `form.Subscribe` for its optimization perks. And if you need the reactivity within the logic, then `useStore` is the better choice.
