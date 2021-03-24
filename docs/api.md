# API

- [`useForm`](#useform)
- [`useField`](#usefield)
- [`splitFormProps`](#splitformprops)
- [`useFormContext`](#useformcontext)

## `useForm`

```js
import { useForm } from 'react-form'

const instance = useForm(options)
```

### Form Options

- `defaultValues: any`
  - Use defaultValues to set the default values state for the form. If this object ever changes, the state will be reset to the new object. Thus, its important to use React.useMemo to make this object only change when necessary
- `onSubmit(values, instance) => Promise`
  - `onSubmit` is called when the form's Form element is submitted or when `instance.handleSubmit` is called.
  - `values` is the submitted values object for the form
  - `instance` is the latest version of the form instance (the same instance that is returned from `useForm`)
  - If the promise returned from this function resolves, `instance.isSubmitted` will be set to `true`
  - When the promise returned from this function settles, `instance.isSubmitting` will be set to `false`
- `validate async (values, instance) => String | false | undefined`
  - `validate` is an asynchronous function that is called when the form becomes dirty and is given the opportunity to set/clear/update errors and/or manage general form state
  - `instance` is the latest version of the form instance (the same instance that is returned from `useForm`)
  - [See below](#form-validation) for more information on form validation
  - Field level validation is also available. [See `useField`](#useField)
- `validatePristine: Bool`
  - If you want validation to run when instance.isDirty is false, you can set the `validatePristine` option to `true`
- `debugForm: Bool`
  - If set to `true` the form instance will be serialized and rendered after the `Form` element returned by the instance
  
### Form Instance

An `object` with the following components, properties and methods:

- `Form: ReactComponent<form>`
  - **Required**
  - This component is a ready-to-use wrapper around the html `form` element.
  - It will proxy any props you pass it, excluding `onSubmit`.
    - It properly supplies the form context to any `useField` instances inside it.
- `values: any`
  - The current values for the entire form
- `meta: Object`

  - `error: String | any`
    - If an error is returned by the form's `validation` function, or if it is set programmatically, it will be stored here.
  - `isSubmitting: Bool`
    - Will be set to `true` if the form is currently submitting
  - `isTouched: Bool`
    - Will be set to `true` if the form is dirty
  - `isSubmitted: Bool`
    - Will be set to `true` if the form has been submitted successfully
  - `submissionAttempts: Int`
    - Will be incremented, starting from `0`, every time a form submission is attempted
  - `isValid: Bool`
    - Will be set to `true` if `isDirty === true` and `isValid === true`, meaning that the form has been touched and there are no field-level or form-level errors
  - `fieldsAreValidating`
    - Will be `true` if there are any fields validating (`field.meta.isValidating`)
  - `fieldsAreValid`
    - Will be `true` if there are no fields with an error (`field.meta.error`)
  - `isValid`
    - Will be `true` if every field is valid and there is no form error (`instance.meta.allFieldsValid && !instance.meta.error`)
  - `canSubmit: Bool`
    - Will be `true` if the form is valid and not in the middle of a submission attempt (`instance.meta.isValid && !instance.meta.isSubmitting`)
    - This can be used to enable/disable a submit button for the form.
  - `...any`
    - Any other meta information can be stored here via the `field.setMeta` or `instance.setFieldMeta` functions

- `formContext: FormInstance`
  - This can be used to manually link `useField` instances to a parent form. This is useful if `useField` is in the same block scope as `useForm`.
  - Simply pass `formContext` to `useField` like so: `useField(fieldName, { formContext })`. That field is now linked to the form that provided the `formContext`.
- `reset() => void`
  - This function will reset the form's state, and set `instance.values` to the `defaultValues` option
- `setMeta((updater(previousMeta: Object) => newMeta: Object) | newMeta: Object)`
  - Use this function to update the form's `meta` value.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
- `handleSubmit(formSubmitEvent) => void`
  - This function is used to submit the form.
  - It is automatically called when using the `Form` component returned by `useTable`.
  - If you build your form using your own `form` element, this function is required and should be set as the callback to the `form` via the `onSubmit` prop
- `debounce(Function, wait: Int) => Promise`
  - This function can be used to debounce any function at the specified wait time. Calls to this function will be deduped per form-instance.
  - Typically, this function is used in the `validate` callback to control validation timing and flow
  - A new promise is returned for each call to this function
  - Over the course of multiple overlapping calls to this function, only the latest active promise that both fires and finishes will actually resolve or reject. In other words, if you call this function before a previous call to it resolves, all previous calls will be discarded and never resolve or reject so as to avoid unwanted side effects from stale promises. Turns out this is easier than cancelling promises :)
- `setValues(updater(previousValues: Object) => newValues: Object) | newValues: Object`
  - Use this function to update the form's `meta` value.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - If a value is passed, it **will replace the entire values** object, similar to React's `setState` callback style.
- `runValidation() => void`
  - Use this function to manually run the form-level validation.
  - This function does not run validation for fields. If that is a requirement you have, the please file a feature request and I'll make it happen.
- `getFieldValue(fieldPath: String) => any`
  - This function returns the `value` from the form's `instance.values` object located at the `fieldPath` string that was passed.
  - `fieldPath` is a string that supports object notation, eg. `foo[3].bar[1].baz`
- `getFieldMeta(fieldPath: String) => Object: { error: String | null, ...any }`
  - This function returns a field's `meta` object from the form.
  - `fieldPath` is a string that supports object notation, eg. `foo[3].bar[1].baz`
- `setFieldValue(fieldPath: String, (updater(previousValue: any) => newValue: any) | newValue: any, options: Object { isTouched: Bool } )`
  - Use this function to update a field's corresponding `value` that is stored in the `instance.values` object.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
  - Optionally, an `options` object can be passed.
    - `isTouched: Bool`
      - Defaults to `true`
      - If set to `false`, this operation will not trigger the field's `isTouched` to automatically be set to `true`
- `setFieldMeta(fieldPath: String, (updater(previousMeta: Object) => newMeta: Object) | newMeta: Object)`
  - Use this function to update a fields `meta` value.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
- `pushFieldValue(fieldPath: String, newValue: any)`
  - Use this function to push a new value into a field that has an array-like value.
  - An error will be thrown if the field's current value is not an array.
- `insertFieldValue(fieldPath: String, insertIndex: Int, value: any)`
  - Use this function to insert a new value into a field that has an array-like value at the specified index.
  - An error will be thrown if the field's current value is not an array.
- `removeFieldValue(fieldPath: String, removalIndex: Int)`
  - Use this function to remove a value from a field that has an array-like value at the specified index.
  - An error will be thrown if the field's current value is not an array.
- `swapFieldValues(fieldPath: String, firstIndex: Int, secondIndex: Int)`
  - Use this function to swap two values inside of a field that has an array-like value at the specified indices.
  - An error will be thrown if the field's current value is not an array.

## `useField`

```js
import { useField } from 'react-form'

const fieldInstance = useField(fieldPath, options)
```

### Field Options

- `fieldPath: String`
  - **Required**
  - The path the value for this field.
  - Supports deeply nested object notation, eg. `foo[3].bar[1].baz`
  - Any integers that can be reliably detected between notation boundaries will be treated as array indices: `1`, `[1]`, `1.`, `.1.` or `.1`
- `options` - An optional object to configure the field
  - `defaultValue: any`
    - Use `defaultValue` to set the default `value` state for the field.
    - If this object ever changes, the field meta will be reset to the new value. Thus, its important to use `React.useMemo` to make this object only change when necessary
  - `defaultError: String | undefined`
    - Use `defaultError` to set the default `error` state for the field.
    - If this object ever changes, the field meta will be reset to the new value. Thus, its important to use `React.useMemo` to make this object only change when necessary
  - `defaultIsTouched: Bool | undefined`
    - Use `defaultIsTouched` to set the default `isTouched` state for the field.
    - If this object ever changes, the field meta will be reset to the new value. Thus, its important to use `React.useMemo` to make this object only change when necessary
  - `defaultMeta: Object | undefined`
    - Use `defaultMeta` to set any additional default `meta` state for the field.
    - Unlike `defaultValue`, `defaultError` and `defaultIsTouched`, changing this object will not trigger the field meta to be updated. It is only updated when the `useField` hook mounts and `meta` for that field has not yet been initialized (`meta === undefined`)
  - `validate async (value, instance) => String | false | undefined`
    - `validate` is an asynchronous function that is called when the field becomes dirty and is given the opportunity to set/clear/update errors and/or manage general field meta
    - `instance` is the latest version of the field instance (the same instance that is returned from `useField`)
    - [See below](#validation) for more information on field validation
    - Form level validation is also available. [See `useForm`](#useform)
  - `filterValue: (value, instance) => newValue`
    - The `filterValue` function is used to manipulate new values before they are set via `field.setValue` and `instance.setFieldValue`.
    - This is useful for restricting fields to specific values, eg. min/max, length, regex replacement, disallowing invalid values (as opposed to warning about them), among limitless others.
  - `validatePristine: Bool`
    - If you want validation to run when instance.isDirty is false, you can set the `validatePristine` option to `true`

### Field Instance

An `object` with the following components, properties and methods:

- `form: FormInstance`
  - The root form `instance`
- `fieldName: String`
  - The full fieldName (from the root of the form) for this field
- `value: any`
  - The current value of this field
- `meta: Object {}`
  - `error: String | any`
    - If an error is returned by the field's `validation` function, or if it is set programmatically, it will be stored here.
  - `isTouched: Bool`
    - Will be set to `true` if the field has been touched.
  - `...any`
    - Any other meta information can be stored here via the `field.setMeta` or `instance.setFieldMeta` functions
- `FieldScope: ReactComponent<Provider>`
  - Optional
  - This component does not render any markup
  - It set the new base field scope to this field's `fieldpath`
  - It supplies this new base field scope, along with the form scope to any `useField` instances inside it.
  - Any `useField(fieldPath)` instances used insde of `FieldScope` will inherit this field's `fieldPath` as a parent.
  - See [Field Scoping](#field-scoping) for more information
- `debounce(Function, wait: Int) => Promise`
  - This function can be used to debounce any function at the specified wait time. Calls to this function will be deduped per `useField` instance.
  - Typically, this function is used in the `validate` callback to control validation timing and flow
  - A new promise is returned for each call to this function
  - Over the course of multiple overlapping calls to this function, only the latest active promise that both fires and finishes will actually resolve or reject. In other words, if you call this function before a previous call to it resolves, all previous calls will be discarded and never resolve or reject so as to avoid unwanted side effects from stale promises. Turns out this is easier than cancelling promises :)
- `runValidation() => void`
  - Use this function to manually run this field's validation.
  - This function does not run validation for fields.
- `getInputProps(props: Object {}) => enhanced props Object`
  - `onChange: ChangeEventHandler`
  - `onBlur: FormEventHandler`
  - `...rest` - any other props that will be spread into the enhanced props
  - Use this function to set props on input elements. If set, `onChange` and `onBlur` will be wrapped to update the field `value`.
  - The enhanced props will always contain `value`, `onChange`, and `onBlur`. Any of the rest that are passed in will also be returned.

#### Field-Specific Methods

The following methods do not require the use of a `fieldPath`. This field's `fieldPath` will automatically be used.

- `setValue((updater(previousValue: any) => newValue: any) | newValue: any, options: Object { isTouched: Bool } )`
  - Use this function to update a field's corresponding `value` that is stored in the `instance.values` object.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
  - Optionally, an `options` object can be passed.
    - `isTouched: Bool`
      - Defaults to `true`
      - If set to `false`, this operation will not trigger the field's `isTouched` to automatically be set to `true`
- `setMeta((updater(previousMeta: Object) => newMeta: Object) | newMeta: Object)`
  - Use this function to update a fields `meta` value.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
- `pushValue(newValue: any)`
  - Use this function to push a new value into a field that has an array-like value.
  - An error will be thrown if the field's current value is not an array.
- `insertValue(insertIndex: Int, value: any)`
  - Use this function to insert a new value into a field that has an array-like value at the specified index.
  - An error will be thrown if the field's current value is not an array.
- `removeValue(removalIndex: Int)`
  - Use this function to remove a value from a field that has an array-like value at the specified index.
  - An error will be thrown if the field's current value is not an array.
- `swapValues(firstIndex: Int, secondIndex: Int)`

  - Use this function to swap two values inside of a field that has an array-like value at the specified indices.
  - An error will be thrown if the field's current value is not an array.

#### Field-Scope Specific Methods

The following methods are almost exactly the same as their top-level form `instance` counterparts, except for any `fieldPath` that is passed to them will be prefixed with this field's `fieldPath`

For example, if our field had the `fieldPath` of `foo`, then `setFieldValue('[0]', true)` would be similar to calling `instance.setFieldValue('foo[0]', true)`

- `setFieldValue(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `setFieldMeta(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `pushFieldValue(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `insertFieldValue(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `removeFieldValue(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `swapFieldValues(subFieldPath, ...)` - [See Form Instance](#form-instance)

#### Using `useField` in the same scope as `useForm`

If you get into a situation where you need to use `useForm` and `useField` in the same block scope, you may see a missing form context error. This is because your `useField` usage is not inside of a `<Form>` component. To get around this error for this use case, you can pass the form's `instance.formContext` value to the `useField` options to manually link them together:

```js
function App() {
  const { Form, formContext } = useForm()

  // This field will now be manually linked to the form above
  const fieldInstance = useField('age', {
    formContext,
  })

  return <Form>...</Form>
}
```

## `splitFormProps`

A utility function for filter React-Form-related props from an object.

```js
import { splitFormProps } from 'react-form'

function TextField(props) {
  const [field, options, rest] = splitFormProps(props)

  // options === {
  //   defaultValue,
  //   defaultIsTouched,
  //   defaultError,
  //   defaultMeta,
  //   validatePristine,
  //   validate,
  //   onSubmit,
  //   defaultValues,
  //   debugForm,
  // }

  const fieldInstance = useField(field, options)

  return <input {...rest} />
}
```

## `useFormContext`

A hook for gaining access to the form state from within a `Form` component

```js
import { useFormContext } from 'react-form'

function App() {
  const { Form } = useForm()

  return (
    <Form>
      <Stuff />
    </Form>
  )
}

function Stuff() {
  const formInstance = useFormContext()

  console.log(formInstance)
}
```
