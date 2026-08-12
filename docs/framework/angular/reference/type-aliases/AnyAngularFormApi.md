---
id: AnyAngularFormApi
title: AnyAngularFormApi
---

# Type Alias: AnyAngularFormApi

```ts
type AnyAngularFormApi = AnyInternalFormApi;
```

Defined in: [form-type.ts:33](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-type.ts#L33)

An Angular form API whose form data, validator, and submit types are erased.

Use it for reusable Angular components that only need form operations common
to every form. Field paths and values are not checked against a particular
form shape; use `AngularFormType` when a component depends on one known form.

## Example

```ts
@Component({
  selector: 'app-reset-button',
  template: `
    <button type="button" (click)="form().reset()">Reset</button>
  `,
})
export class ResetButtonComponent {
  form = input.required<AnyAngularFormApi>()
}
```
