# Type alias: FieldComponent()\<TParentData, TFormValidator\>

```ts
type FieldComponent<TParentData, TFormValidator>: <TName, TFieldValidator, TData>(fieldOptions, context) => any;
```

## Type parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

## Type parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

• **fieldOptions**: `Omit`\<`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>, `"form"`\>

• **context**: `SetupContext`\<`object`, `SlotsType`\<`object`\>\>

## Returns

`any`

## Source

[packages/vue-form/src/useField.tsx:117](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/vue-form/src/useField.tsx#L117)
