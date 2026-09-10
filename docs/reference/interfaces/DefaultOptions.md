---
id: DefaultOptions
title: DefaultOptions
---

# Interface: DefaultOptions

Defined in: [defaultOptions.public.ts:132](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L132)

Collects the reusable defaults owned by one form.

Each API resolves its usage-site options against the corresponding entry.
The defaults remain form-wide configuration rather than becoming part of
form, field, or group value inference.

## Properties

### field?

```ts
optional field?: DefaultFieldOptions;
```

Defined in: [defaultOptions.public.ts:136](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L136)

Defaults resolved against field options.

***

### form?

```ts
optional form?: DefaultFormOptions;
```

Defined in: [defaultOptions.public.ts:134](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L134)

Defaults resolved against form options.

***

### formGroup?

```ts
optional formGroup?: DefaultFormGroupOptions;
```

Defined in: [defaultOptions.public.ts:138](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L138)

Defaults resolved against form-group options.
