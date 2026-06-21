---
id: FieldMeta
title: FieldMeta
---

# Interface: FieldMeta\<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn\>

Defined in: [FieldApi/FieldApi.public.ts:50](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L50)

## Extends

- [`BaseFieldMeta`](BaseFieldMeta.md)

## Type Parameters

### TFieldValidatorMetas

`TFieldValidatorMetas` *extends* [`FieldValidatorMetas`](../type-aliases/FieldValidatorMetas.md)

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* [`FormGroupValidatorMetas`](../type-aliases/FormGroupValidatorMetas.md)

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`

## Properties

### errors

```ts
errors: FieldErrors<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FieldApi/FieldApi.public.ts:65](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L65)

***

### isBlurred

```ts
isBlurred: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:19](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L19)

#### Inherited from

[`BaseFieldMeta`](BaseFieldMeta.md).[`isBlurred`](BaseFieldMeta.md#isblurred)

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:57](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L57)

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:18](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L18)

#### Inherited from

[`BaseFieldMeta`](BaseFieldMeta.md).[`isDirty`](BaseFieldMeta.md#isdirty)

***

### isInvalid

```ts
isInvalid: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:60](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L60)

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:56](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L56)

***

### isSelfDirty

```ts
isSelfDirty: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:59](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L59)

***

### isSelfTouched

```ts
isSelfTouched: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:58](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L58)

***

### isSelfValid

```ts
isSelfValid: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:61](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L61)

***

### isSelfValidating

```ts
isSelfValidating: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:62](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L62)

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:17](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L17)

#### Inherited from

[`BaseFieldMeta`](BaseFieldMeta.md).[`isTouched`](BaseFieldMeta.md#istouched)

***

### isValid

```ts
isValid: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:63](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L63)

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:20](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L20)

#### Inherited from

[`BaseFieldMeta`](BaseFieldMeta.md).[`isValidating`](BaseFieldMeta.md#isvalidating)

***

### original

```ts
original: OriginalFieldMeta<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FieldApi/FieldApi.public.ts:71](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L71)

***

### subfields

```ts
subfields: SubfieldsMeta;
```

Defined in: [FieldApi/FieldApi.public.ts:64](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L64)
