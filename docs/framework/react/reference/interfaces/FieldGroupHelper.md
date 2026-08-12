---
id: FieldGroupHelper
title: FieldGroupHelper
---

# Interface: FieldGroupHelper

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:222](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L222)

## Properties

### loose

```ts
loose: <TValue>() => LooseFieldGroupFieldSlot<TValue>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:248](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L248)

Declares a virtual field that can bind to form fields with an overlapping
non-nullish value type instead of requiring an exact type match.

#### Type Parameters

##### TValue

`TValue`

#### Returns

[`LooseFieldGroupFieldSlot`](../type-aliases/LooseFieldGroupFieldSlot.md)\<`TValue`\>

#### Example

```tsx
const passwordFieldGroup = defineFieldGroup(({ loose }) => ({
  password: loose<string>(),
  confirmPassword: loose<string>(),
}))
```

***

### strict

```ts
strict: <TValue>() => StrictFieldGroupFieldSlot<TValue>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:235](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L235)

Declares a virtual field whose value type must exactly match the value type
of the concrete form field it binds to.

#### Type Parameters

##### TValue

`TValue`

#### Returns

[`StrictFieldGroupFieldSlot`](../type-aliases/StrictFieldGroupFieldSlot.md)\<`TValue`\>

#### Example

```tsx
const passwordFieldGroup = defineFieldGroup(({ strict }) => ({
  password: strict<string>(),
  confirmPassword: strict<string>(),
}))
```
