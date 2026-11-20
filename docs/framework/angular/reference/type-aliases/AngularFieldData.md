---
id: AngularFieldData
title: AngularFieldData
---

```ts
type AngularFieldData<TSource> = TSource extends InternalFormGroupApi<any, any, infer TGroupValue, any, any> ? TGroupValue : TSource extends FormApi<infer TFormData, any> ? TFormData : never;
```

Defined in: [tanstack-field.ts:33](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L33)

## Type Parameters

### TSource

`TSource` *extends* [`AngularFieldSource`](AngularFieldSource.md)
