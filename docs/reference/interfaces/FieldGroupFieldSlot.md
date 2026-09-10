---
id: FieldGroupFieldSlot
title: FieldGroupFieldSlot
---

# Interface: FieldGroupFieldSlot\<TValue, TMode\>

Defined in: [FieldGroup/fieldGroupTypes.public.ts:27](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L27)

Describes the value type and matching rule for one virtual field in a
reusable field group.

Slots are type markers consumed by a field-group definition. Their
properties are not available at runtime.

Create slots with `FieldGroupHelper.strict` or `FieldGroupHelper.loose`
inside a field-group definition instead of constructing them directly.

## Type Parameters

### TValue

`TValue`

The value type declared for the virtual field.

### TMode

`TMode` *extends* [`FieldGroupFieldSlotMode`](../type-aliases/FieldGroupFieldSlotMode.md) = [`FieldGroupFieldSlotMode`](../type-aliases/FieldGroupFieldSlotMode.md)

Library-managed. Do not specify explicitly.

## Properties

### \[fieldGroupFieldSlotValueSymbol\]

```ts
readonly [fieldGroupFieldSlotValueSymbol]: TValue;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:34](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L34)

Preserves the declared value type for type-level inference.

***

### mode

```ts
readonly mode: TMode;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:32](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L32)

Represents the slot's value-type matching rule at the type level.
