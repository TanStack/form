---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:110](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L110)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](../type-aliases/AnySvelteFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:113](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L113)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:114](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L114)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:115](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L115)

***

### useFormContext

```ts
useFormContext: () => SvelteAppFormApi<any, any, TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:116](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L116)

#### Returns

[`SvelteAppFormApi`](../type-aliases/SvelteAppFormApi.md)\<`any`, `any`, `TComponents`\>
