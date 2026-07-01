---
id: FieldUpdateOptions
title: FieldUpdateOptions
---

# Interface: FieldUpdateOptions

Defined in: [packages/form-core/src/types.public.ts:6](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/types.public.ts#L6)

## Properties

### causeValidation?

```ts
optional causeValidation: boolean;
```

Defined in: [packages/form-core/src/types.public.ts:30](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/types.public.ts#L30)

Whether to cause a validation run from the update.

#### Default

```ts
true
```

***

### markAsBlurred?

```ts
optional markAsBlurred: boolean;
```

Defined in: [packages/form-core/src/types.public.ts:24](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/types.public.ts#L24)

Whether to mark the field as blurred from the update.

@default: Only true if the emitted event is a blur

***

### markAsDirty?

```ts
optional markAsDirty: boolean;
```

Defined in: [packages/form-core/src/types.public.ts:18](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/types.public.ts#L18)

Whether to mark the field as dirty from the update.

#### Default

```ts
true
```

***

### markAsTouched?

```ts
optional markAsTouched: boolean;
```

Defined in: [packages/form-core/src/types.public.ts:12](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/types.public.ts#L12)

Whether to mark the field as touched from the update.

#### Default

```ts
true
```
