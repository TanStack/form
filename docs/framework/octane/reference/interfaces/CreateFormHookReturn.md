---
id: CreateFormHookReturn
title: CreateFormHookReturn
---

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:478](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L478)

## Type Parameters

### TComponents

`TComponents` *extends* `Record`\<`string`, `HookComponentType`\<`any`\>\>

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `HookComponentType`\<`any`\>\>

## Properties

### extendForm()

```ts
extendForm: <TNewField, TNewForm>(extension) => CreateFormHookReturn<TComponents & TNewField, TFormComponents & TNewForm>;
```

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:486](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L486)

#### Type Parameters

##### TNewField

`TNewField` *extends* `FieldComponentExtension`\<`TComponents`\>

##### TNewForm

`TNewForm` *extends* `FormComponentExtension`\<`TFormComponents`\>

#### Parameters

##### extension

###### fieldComponents?

`TNewField`

###### formComponents?

`TNewForm`

#### Returns

`CreateFormHookReturn`\<`TComponents` & `TNewField`, `TFormComponents` & `TNewForm`\>

***

### useAppForm

```ts
useAppForm: UseAppForm<TComponents, TFormComponents>;
```

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:482](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L482)

***

### useTypedAppFormContext

```ts
useTypedAppFormContext: UseTypedAppFormContext<TComponents, TFormComponents>;
```

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:485](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L485)

***

### withFieldGroup

```ts
withFieldGroup: WithFieldGroup<TComponents, TFormComponents>;
```

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:484](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L484)

***

### withForm

```ts
withForm: WithForm<TComponents, TFormComponents>;
```

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:483](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L483)
