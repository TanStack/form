---
id: DefaultOptions
title: DefaultOptions
---

Defined in: [defaultOptions.public.ts:131](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L131)

Collects the reusable defaults owned by one form.

Each API resolves its usage-site options against the corresponding entry.
The defaults remain form-wide configuration rather than becoming part of
form, field, or group value inference.

## Properties

### field?

```ts
optional field?: DefaultFieldOptions;
```

Defined in: [defaultOptions.public.ts:135](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L135)

Defaults resolved against field options.

***

### form?

```ts
optional form?: DefaultFormOptions;
```

Defined in: [defaultOptions.public.ts:133](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L133)

Defaults resolved against form options.

***

### formGroup?

```ts
optional formGroup?: DefaultFormGroupOptions;
```

Defined in: [defaultOptions.public.ts:137](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L137)

Defaults resolved against form-group options.
