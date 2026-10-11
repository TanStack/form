---
id: ErrorVisibilitySubfieldsMeta
title: ErrorVisibilitySubfieldsMeta
---

Defined in: [validation.public.ts:266](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L266)

Descendant field state available when deciding whether to show errors.

## Properties

### isEveryPristine

```ts
isEveryPristine: boolean;
```

Defined in: [validation.public.ts:268](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L268)

`true` when no descendant field is marked as dirty.

***

### isSomeDirty

```ts
isSomeDirty: boolean;
```

Defined in: [validation.public.ts:270](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L270)

`true` when at least one descendant field is marked as dirty.

***

### isSomeTouched

```ts
isSomeTouched: boolean;
```

Defined in: [validation.public.ts:272](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L272)

`true` when at least one descendant field is marked as touched.

***

### isSomeValidating

```ts
isSomeValidating: boolean;
```

Defined in: [validation.public.ts:274](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L274)

`true` while at least one descendant field is validating.
