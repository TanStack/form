---
id: SvelteTanStackFormComponents
title: SvelteTanStackFormComponents
---

Defined in: [packages/svelte-form/src/Components.public.ts:345](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L345)

## Extends

- `SvelteFieldComponentsType`\<`TFieldComponents`\>

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\> = `Record`\<`never`, `never`\>

## Properties

### \[fieldComponentsSymbol\]?

```ts
readonly optional [fieldComponentsSymbol]?: TFieldComponents;
```

Defined in: [packages/svelte-form/src/fieldComponentsType.lib.ts:9](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/fieldComponentsType.lib.ts#L9)

#### Inherited from

```ts
SvelteFieldComponentsType.[fieldComponentsSymbol]
```

***

### ArrayField

```ts
ArrayField: SvelteFormArrayFieldComponent<TFormData, TFormError, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:354](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L354)

***

### Field

```ts
Field: SvelteFormFieldComponent<TFormData, TFormError, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:353](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L353)

***

### FormGroup

```ts
FormGroup: SvelteFormGroupComponent<TFormData, TFormError, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:360](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L360)

***

### Subscribe

```ts
Subscribe: SvelteFormSubscribeComponent<TFormData, TFormError>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:359](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L359)
