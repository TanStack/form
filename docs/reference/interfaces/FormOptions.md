---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidators, TSubmitReturn\>

Defined in: [FormApi/FormApi.public.ts:147](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L147)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Properties

### defaultValues

```ts
defaultValues: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:153](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L153)

***

### errorVisibility?

```ts
optional errorVisibility?: ErrorVisibility<TFormData, ToFormErrorTypes<TFormValidators, unknown>>;
```

Defined in: [FormApi/FormApi.public.ts:154](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L154)

***

### formId?

```ts
optional formId?: string;
```

Defined in: [FormApi/FormApi.public.ts:152](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L152)

***

### listeners?

```ts
optional listeners?: FormListeners<TFormData, ToFormErrorTypes<TFormValidators, unknown>>;
```

Defined in: [FormApi/FormApi.public.ts:159](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L159)

***

### onSubmit?

```ts
optional onSubmit?: (context) => TSubmitReturn;
```

Defined in: [FormApi/FormApi.public.ts:183](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L183)

Called after submission validation succeeds.

Return an error created with `createValidationError` or `parseIssues` to
mark the submission as invalid.

#### Parameters

##### context

[`FormSubmitContext`](FormSubmitContext.md)\<`TFormData`, [`ToFormSchemaOutputs`](../type-aliases/ToFormSchemaOutputs.md)\<`TFormValidators`\>, [`ToFormErrorTypes`](../type-aliases/ToFormErrorTypes.md)\<`TFormValidators`, `unknown`\>\>

#### Returns

`TSubmitReturn`

#### Example

```ts
{
  // ...
  onSubmit: async ({ value }) => {
    await saveUser(value)
  },
}
```

***

### onSubmitInvalid?

```ts
optional onSubmitInvalid?: (context) => void | Promise<void>;
```

Defined in: [FormApi/FormApi.public.ts:206](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L206)

Called when validation fails, `onSubmit` returns an error, or validation
or submission throws. The callback is awaited before submission finishes.

#### Parameters

##### context

[`FormSubmitInvalidContext`](FormSubmitInvalidContext.md)\<`TFormData`, [`ToFormErrorTypes`](../type-aliases/ToFormErrorTypes.md)\<`TFormValidators`, `unknown`\>\>

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```ts
{
  // ...
  onSubmitInvalid: () => {
    document
      .querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus()
  },
}
```

***

### serverState?

```ts
optional serverState?: 
  | ServerFormState<NoInfer<TFormData>, NoInfer<TFormValidators>>
  | null;
```

Defined in: [FormApi/FormApi.public.ts:163](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L163)

***

### validators?

```ts
optional validators?: TFormValidators;
```

Defined in: [FormApi/FormApi.public.ts:158](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L158)
