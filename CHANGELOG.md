# 3.0.0
#### New Features
- The `Form` component is now a FAAC (function-as-a-child) component which supports the "big three" FAAC formats (`component` and `render`/`children` functions).
- The `FormField` component has been renamed to `Field` and is now a FAAC (function-as-a-child) component which supports the "big three" FAAC formats (`component` and `render`/`children` functions).
- `withFormField` is a new dedicated HOC function, which mirrors the capabilities of `Field` but with the HOC syntax.
- Added a new `FormApi` FAAC component and companion `withFormApi` HOC which allow you to access the nearest formApi ancestor from anywhere in your component tree.
- Added `pure` prop to `Field` and `withField` components. While using the `pure` prop, the `Field` instance will only rerender when form state or shallow prop values change. Use this to increase performance on large forms as long as you are aware of its implications.
- The api supplied by `Field`/`withField` now contains field-level methods for `addValue`, `removeValue`, and `swapValue`.
- `FieldContext`/`withFieldContext` is a new component that is replacing and deprecatin the `NestedForm` components. `FieldContext` allows you to set a new field context for any child `Field` and `FormApi` components. This allows for extremely implicit field declarations within components without having to worry about form composition.
#### Breaking Changes
- `Field` is now a FAAC, not an HOC. You can either directly replace it with the `withFormField` HOC, or adopt the inline FAAC format.
- All `RadioGroup` components have been deprecated in favor of using the `field` prop directly on any `Radio` components.
- `Form`'s '`dontValidateOnMount` is now `validatedOnMount` and defaults to false. If you want to validate on mount, use the `validateOnMount` prop.
- Polyfills for `Array.find`, `Array.findIndex` and `Array.includes` are no longer provided with the library. If your target browsers do not support these methods, please manually include a polyfill for these methods in your app.
- The `fieldApi` prop continues to be available, but only when using HOC or FAAC-component-prop syntaxes. When using the FAAC render prop or child-as-a-function syntax's, the `fieldApi` object is directly spread into the render and child-as-a-function's main prop parameter.
- All value getters located on the `fieldApi` are now static values eg. (`getValue()` is now `value`, `setTouched()` is now `touched`, and so on with `getError`, `getSuccess` and `getWarning`).
- `NestedForm` has been deprecated in favor of the `FormFieldContext` component and field-level default values and validations.
