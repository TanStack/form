# 3.0.0
#### New Features
- The `FormField` component is now a FAAC (function-as-a-child) component which supports the "big three" FAAC formats (`component` and `render`/`children` functions).
- `withFormField` is a new dedicated HOC function, which mirrors the capabilities of `FormField` but with the HOC syntax.
- Added a new `FormApi` FAAC component and companion `withFormApi` HOC which allow you to access the nearest formApi ancestor from anywhere in your component tree.
- Added `pure` prop to `FormField` and `withFormField` components. While using the `pure` prop, the `FormField` instance will only rerender when form state or shallow prop values change. Use this to increase performance on large forms as long as you are aware of its implications.
- The api supplied by `FormField`/`withFormField` now contains field-level methods for `addValue`, `removeValue`, and `swapValue`.
#### Breaking Changes
- `FormField` is now a FAAC, not an HOC. You can either directly replace it with the `withFormField` HOC, or adopt the inline FAAC format.
- All `RadioGroup` components have been deprecated in favor of using the `field` prop directly on any `Radio` components.
- `Form`'s '`dontValidateOnMount` is now `validatedOnMount` and defaults to false. If you want to validate on mount, use the `validateOnMount` prop.
