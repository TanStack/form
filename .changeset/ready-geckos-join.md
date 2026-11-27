---
'@tanstack/react-form': minor
---

- `getFormHookHelpers()` now returns `formComponent`, `fieldComponent` and `formContext`.

- Omitted `field` or `form` props in form composition now respect union props

BREAKING changes:

- `createFormHook` no longer returns `useFormContext`. Use `formComponent.create` instead.
- `form.AppForm` no longer exists, as the new `formComponent.create` does not need it.

- `fieldComponent` and `fieldBrand` both changed their API approach. The new approach no longer needs the separation.

| Old implementation                                            | New implementation                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `const { fieldComponent, fieldBrand } = getFormHookHelpers()` | `const { fieldComponent, formComponent } = getFormHookHelpers()`               |
| `fieldComponent.strict(TextInput, 'field')`                   | `fieldComponent.strict()({ component: TextInput, replaceProperty: 'field' })`  |
| `fieldComponent.loose(FieldErrors, 'field')`                  | `fieldComponent.loose()({ component: FieldErrors, replaceProperty: 'field' })` |
| `fieldBrand.strict<string>()(Adornment)`                      | `fieldComponent.strict<string>()({ component: Adornment })`                    |
| `fieldBrand.loose<unknown>()(Description)`                    | `fieldComponent.loose<unknown>()({ component: Description })`                  |
