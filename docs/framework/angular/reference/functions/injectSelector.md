---
id: injectSelector
title: injectSelector
---

```ts
function injectSelector<TFormData, TFormError, TSelected>(
   form, 
   selector?, 
options?): Signal<TSelected>;
```

Defined in: [inject-selector.ts:7](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-selector.ts#L7)

Selects form state as an Angular signal.

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>

### TSelected

`TSelected` = `NoInfer`\<`FormState`\<`TFormData`, `TFormError`\>\>

## Parameters

### form

`FormApi`\<`TFormData`, `TFormError`\>

### selector?

(`state`) => `TSelected`

### options?

`InjectSelectorOptions`\<`TSelected`\>

## Returns

`Signal`\<`TSelected`\>
