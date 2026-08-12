---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:25](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L25)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyPreactFormComponentMap`](../type-aliases/AnyPreactFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:28](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L28)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:29](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L29)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:30](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L30)

***

### useFormContext

```ts
useFormContext: () => PreactAppFormApi<any, any, TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:31](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L31)

#### Returns

[`PreactAppFormApi`](../type-aliases/PreactAppFormApi.md)\<`any`, `any`, `TComponents`\>
