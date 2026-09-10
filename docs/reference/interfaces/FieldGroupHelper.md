---
id: FieldGroupHelper
title: FieldGroupHelper
---

# Interface: FieldGroupHelper

Defined in: [FieldGroup/fieldGroupTypes.public.ts:259](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L259)

Declares the virtual fields in a reusable field group and how their value
types may bind to concrete form fields.

## Example

```ts
const profileFields = defineFieldGroup(({ strict, loose }) => ({
  name: strict(''),
  status: loose<string>(),
}))
```

## Properties

### loose

```ts
loose: {
<TValue>  (value): LooseFieldGroupFieldSlot<TValue>;
<TValue>  (): LooseFieldGroupFieldSlot<TValue>;
};
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:298](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L298)

Declares a virtual field that can bind to form fields whose value type is
assignable to the declared type.

#### Call Signature

```ts
<TValue>(value): LooseFieldGroupFieldSlot<TValue>;
```

##### Type Parameters

###### TValue

`TValue`

Inferred from the representative value.

##### Parameters

###### value

`TValue`

A representative value used only for type inference.

##### Returns

[`LooseFieldGroupFieldSlot`](../type-aliases/LooseFieldGroupFieldSlot.md)\<`TValue`\>

A field slot that uses assignable value-type matching.

#### Call Signature

```ts
<TValue>(): LooseFieldGroupFieldSlot<TValue>;
```

##### Type Parameters

###### TValue

`TValue`

The value type that compatible concrete field values
must be assignable to.

##### Returns

[`LooseFieldGroupFieldSlot`](../type-aliases/LooseFieldGroupFieldSlot.md)\<`TValue`\>

A field slot that uses assignable value-type matching.

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
strict: {
<TValue>  (value): StrictFieldGroupFieldSlot<TValue>;
<TValue>  (): StrictFieldGroupFieldSlot<TValue>;
};
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:272](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L272)

Declares a virtual field whose value type must exactly match the value type
of the concrete form field it binds to.

#### Call Signature

```ts
<TValue>(value): StrictFieldGroupFieldSlot<TValue>;
```

##### Type Parameters

###### TValue

`TValue`

Inferred from the representative value.

##### Parameters

###### value

`TValue`

A representative value used only for type inference.

##### Returns

[`StrictFieldGroupFieldSlot`](../type-aliases/StrictFieldGroupFieldSlot.md)\<`TValue`\>

A field slot that uses strict value-type matching.

#### Call Signature

```ts
<TValue>(): StrictFieldGroupFieldSlot<TValue>;
```

##### Type Parameters

###### TValue

`TValue`

The value type the concrete form field must match
exactly.

##### Returns

[`StrictFieldGroupFieldSlot`](../type-aliases/StrictFieldGroupFieldSlot.md)\<`TValue`\>

A field slot that uses strict value-type matching.

#### Example

```tsx
const passwordFieldGroup = defineFieldGroup(({ strict }) => ({
  password: strict<string>(),
  confirmPassword: strict<string>(),
}))
```
