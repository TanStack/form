---
id: formOptions
title: formOptions
---

```ts
const formOptions: FormOptionsApi<unknown>;
```

Defined in: [FormApi/formOptions.public.ts:415](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L415)

Defines reusable form options with inferred values, validators, and callback
types.

Returns the supplied object unchanged. Pass the result to a framework
adapter's form creation API to create a form.

## Example

```ts
const profileOptions = formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      triggers: ['blur'],
      run: ({ value }) => (value.name.trim() ? undefined : 'Enter a name'),
    },
  ],
})
```
