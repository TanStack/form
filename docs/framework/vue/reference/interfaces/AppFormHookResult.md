---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:23](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L23)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](../type-aliases/AnyVueFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:24](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L24)

***

### getAppFieldGroupHelpers

```ts
getAppFieldGroupHelpers: () => FieldGroupHelpers<TComponents["fieldComponents"]>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:25](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L25)

#### Returns

[`FieldGroupHelpers`](FieldGroupHelpers.md)\<`TComponents`\[`"fieldComponents"`\]\>

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:28](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L28)

***

### useFormContext

```ts
useFormContext: () => VueAppFormApi<any, any, TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:29](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L29)

#### Returns

[`VueAppFormApi`](../type-aliases/VueAppFormApi.md)\<`any`, `any`, `TComponents`\>
