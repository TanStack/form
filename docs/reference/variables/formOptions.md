---
id: formOptions
title: formOptions
---

# Variable: formOptions

```ts
const formOptions: FormOptionsApi;
```

Defined in: [utils.public.ts:323](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L323)

Keeps form data, validator, and submission types inferred when options are
declared separately from a framework's form creation API.

The regular helper takes `defaultValues` at face value as the form data
shape. For schema-driven inference, use `formOptions.strictSchema` when the
schema defines an input-to-output boundary, or `formOptions.looseSchema` when
the schema defines the shape but editable defaults need `null` or
`undefined` values.

At runtime, this is an identity helper: it returns the original options
object and does not create a form or run validation.

## Remarks

**Important:** Although this returns the original object unchanged at
runtime, its type is normalized to `FormOptions`. Optional properties such
as `validators` therefore remain optional even when supplied. This tradeoff
enables safer inference and reuse.

## Example

```ts
const profileOptions = formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      triggers: ['change'],
      run: ({ value }) =>
        value.name.length === 0 ? 'Name is required' : undefined,
    },
  ],
})

const form = useForm({
  ...profileOptions,
  onSubmit: ({ value }) => saveProfile(value),
})
```
