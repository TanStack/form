---
id: Field
title: Field
---

# Variable: Field()

```ts
const Field: <TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>(props) => CreateComponentPublicInstanceWithMixins<UseFieldOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta> & 
  | {
[key: `on${Capitalize<string>}`]: (...args) => any | undefined;
}
  | {
[key: `on${Capitalize<string>}`]: (...args) => any | undefined;
}, {
}, {
}, {
}, {
}, ComponentOptionsMixin, ComponentOptionsMixin, EmitsOptions, PublicProps, {
}, false, {
}, {
}>;
```

Defined in: [packages/vue-form/src/useField.tsx:510](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useField.tsx#L510)

## Parameters

### props

UseFieldOptions\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, ... 14 more ..., TParentSubmitMeta\> & (\{ ...; \} \| \{ ...; \}) & `VNodeProps` & `AllowedComponentProps` & `ComponentCustomProps`

## Returns

`CreateComponentPublicInstanceWithMixins`\<`UseFieldOptions`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\> & 
  \| \{
\[`key`: `` `on${Capitalize<string>}` ``\]: (...`args`) => `any` \| `undefined`;
\}
  \| \{
\[`key`: `` `on${Capitalize<string>}` ``\]: (...`args`) => `any` \| `undefined`;
\}, \{
\}, \{
\}, \{
\}, \{
\}, `ComponentOptionsMixin`, `ComponentOptionsMixin`, `EmitsOptions`, `PublicProps`, \{
\}, `false`, \{
\}, \{
\}\>
