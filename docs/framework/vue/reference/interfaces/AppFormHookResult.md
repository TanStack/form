---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:110](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L110)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](../type-aliases/AnyVueFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:111](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L111)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:112](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L112)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:113](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L113)

***

### useFormContext

```ts
useFormContext: () => VueAppFormApi<any, any, TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:114](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L114)

#### Returns

[`VueAppFormApi`](../type-aliases/VueAppFormApi.md)\<`any`, `any`, `TComponents`\>
