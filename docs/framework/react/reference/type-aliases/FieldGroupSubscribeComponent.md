---
id: FieldGroupSubscribeComponent
title: FieldGroupSubscribeComponent
---

# Type Alias: FieldGroupSubscribeComponent

```ts
type FieldGroupSubscribeComponent = <TSelected>(props) => ReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:170](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L170)

Reads form state from inside a field-group component.

Because a field group can be used with different forms, `state.values`
cannot be safely typed here and is provided as `unknown`.

To read values from this field group, use its `atom` with `useSelector`
instead.

## Type Parameters

### TSelected

`TSelected`

## Parameters

### props

[`FieldGroupSubscribeProps`](FieldGroupSubscribeProps.md)\<`TSelected`\>

## Returns

`ReactNode`

## Example

```tsx
<fields.Subscribe selector={(state) => state.submissionAttempts}>
  {(submissionAttempts) => (
    <span>Submit attempts: {submissionAttempts}</span>
  )}
</fields.Subscribe>
```
