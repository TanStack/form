---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:23](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L23)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](../type-aliases/AnySvelteFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:26](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L26)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:27](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L27)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:28](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L28)

***

### useFormContext

```ts
useFormContext: () => SvelteAppFormApi<any, any, TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:29](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L29)

#### Returns

[`SvelteAppFormApi`](../type-aliases/SvelteAppFormApi.md)\<`any`, `any`, `TComponents`\>
