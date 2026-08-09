---
id: injectSelector
title: injectSelector
---

# Function: injectSelector()

```ts
function injectSelector<TFormData, TFormErrorTypes, TSelected>(
   form, 
   selector?, 
options?): Signal<TSelected>;
```

Defined in: [inject-selector.ts:7](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-selector.ts#L7)

Selects form state as an Angular signal.

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>

### TSelected

`TSelected` = `NoInfer`\<`FormState`\<`TFormData`, `TFormErrorTypes`\>\>

## Parameters

### form

`FormApi`\<`TFormData`, `TFormErrorTypes`\>

### selector?

(`state`) => `TSelected`

### options?

`InjectSelectorOptions`\<`TSelected`\>

## Returns

`Signal`\<`TSelected`\>
