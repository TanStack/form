---
id: ErrorVisibilityFieldMeta
title: ErrorVisibilityFieldMeta
---

Defined in: [validation.public.ts:278](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L278)

Field state flags available to an error visibility policy.

## Properties

### isBlurred

```ts
isBlurred: boolean;
```

Defined in: [validation.public.ts:292](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L292)

`true` when this field is marked as blurred.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [validation.public.ts:290](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L290)

`true` when the current value equals the field's default value.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [validation.public.ts:284](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L284)

`true` when this field or a descendant is marked as dirty.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [validation.public.ts:288](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L288)

`true` when neither this field nor its descendants are marked as dirty.

***

### isSelfDirty

```ts
isSelfDirty: boolean;
```

Defined in: [validation.public.ts:286](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L286)

`true` when this field itself is marked as dirty.

***

### isSelfTouched

```ts
isSelfTouched: boolean;
```

Defined in: [validation.public.ts:282](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L282)

`true` when this field itself is marked as touched.

***

### isSelfValidating

```ts
isSelfValidating: boolean;
```

Defined in: [validation.public.ts:296](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L296)

`true` while this field itself is validating.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [validation.public.ts:280](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L280)

`true` when this field or a descendant is marked as touched.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [validation.public.ts:294](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L294)

`true` while this field or a descendant is validating.

***

### subfields

```ts
subfields: ErrorVisibilitySubfieldsMeta;
```

Defined in: [validation.public.ts:298](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L298)

State flags for this field's descendants.
