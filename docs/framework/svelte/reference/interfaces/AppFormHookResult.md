---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:115](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L115)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](../type-aliases/AnySvelteFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: FormOptionsApi<TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:118](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L118)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:119](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L119)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:120](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L120)

***

### useFormContext

```ts
useFormContext: () => SvelteAppFormApi<any, any, TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:121](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L121)

#### Returns

[`SvelteAppFormApi`](../type-aliases/SvelteAppFormApi.md)\<`any`, `any`, `TComponents`\>
