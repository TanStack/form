---
id: important-defaults
title: Important Defaults
---

Out of the box, TanStack Form is configured with **aggressive but sane** defaults. **Sometimes these defaults can catch new users off guard or make learning/debugging difficult if they are unknown by the user.** Keep them in mind as you continue to learn and use TanStack Form:

- Core
  - Validation
    - By default, only touched, dirty fields are validated on blur and submit. This means that if you have a field that is required, it will not show an error until the user has blurred the field (focused and unfocused) or submitted the form. You can change this to include field `change` events or only the `submit` event with a form default or on a per field basis with the `defaultValidateOn` and `validateOn` options. `validatePristine` can also be used to validate pristine fields.
    - By default, TanStack async validation will only run if synchronous validation succeeds. This is to prevent unnecessary async validation which usually are powered by network requests.
    - By default, TanStack Form will not validate fields that are not registered. This is to prevent unnecessary validation of fields that are not in the DOM. This can be changed with the `validateUnregistered` option.
- React
  - Reactivity
    - The `useForm` hook and `form.Form` component are not reactive, which means that as _any_ form state changes, they will not rerender. If they did, you would likely run into performance problems very quickly. Instead, use:
      - `form.useStore` to subscribe and rerender when form state changes. Selectors are supported.
      - `form.Subscribe` to render a specific sub-tree of UI that is subscribed to the form state. Selectors are supported.
      - `form.useField` to subscribe to a specific field's state changes.
    - `form.Field` **is reactive** to all state changes that happen within a field. This means that as a field's value, error, touched, etc. changes, the component you use it in will rerender. This is a good thing because it means you don't have to worry about manually subscribing to a field's state changes.
