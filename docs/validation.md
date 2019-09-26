# Validation

Validation in React Form supports a wide range of synchronous and asynchronous validation strategies for both individual fields and the entire form itself. Also included in the validation API is the ability to debounce sync and async validation attempts and even manage form and field meta manually.

- [When can a form be submitted?](#when-can-a-form-be-submitted)
- [Submission Attempt Flow](#submission-attempt-flow)
- [Synchronous Validation](#synchronous-validation)
- [Asynchronous Validation](#asynchronous-validation)
- [Mixed Sync + Async Validation:](#mixed-sync--async-validation)
- [Debouncing Form Validation](#debouncing-form-validation)
- [Sync Debouncing](#sync-debouncing)
- [Async Debouncing](#async-debouncing)
- [Mixed Sync/Async Debouncing](#mixed-syncasync-debouncing)
- [Manually manage form `meta` and field `meta`](#manually-manage-form-meta-and-field-meta)

## When can a form be submitted?

A form submission can be attempted when either:

- The form has not been touched `!instance.meta.isTouched`

**OR**

- All fields **with a validation option**
  - Have been touched (`field.meta.isTouched`)
  - Are not validating (`!field.meta.isValidating`)
  - Do not have an error (`field.meta.error`)
- The form has been touched `instance.meta.isTouched`
- The form is not validating `!instance.meta.isValidating`
- The form does not have an error `instance.meta.error`

To simplify handling this state, the following additional booleans are available on the `instance.meta`:

- `instance.meta.fieldsAreValidating`
- `instance.meta.fieldsAreValid`
- `instance.meta.isValid`
- `instance.meta.canSubmit`

See [Form Instance](#form-instance) for more information

## Submission Attempt Flow

Every time a submission attempt is made, the following submission flow will takes place:

- If there are fields that have not been touched or the form has not been touched:
  - All fields will be touched (`field.meta.isTouched === true`)
  - The form is touched (`instance.meta.isTouched === true`)
  - All fields with a `validate` option that have not been touched will be validated
  - If the form `validate` option is set and has not been touched, the form will be validated
  - The submission attempt will wait for any field and form validations to resolve
    - If any field validations or the form validation throw a runtime error
      - The submission attempt will abort 🛑
    - Once all validations settle
      - A new submission will be attempted with the new post-validation state 🔁
- If there are any field or form validation(s) errors
  - The current submission will abort 🛑
- The form's `onSubmit` function will be called ✅

## Synchronous Validation

If you don't need to perform any async validation in your form or field, you can just return an error string directly (or `false` clear an error):

- If a validation function returns a `string`, the value returned will be stored in either the form's `instance.meta.error` or the field's `meta.error` value
- If a validation function returns `false`, the error in either the form's `instance.meta.error` or the field's `meta.error` value the will be set to `null`
- if a validation function returns `undefined`, no changes will happen

```js
const options = {
  validate: value => {
    // To set an error:
    if (!somethingIsWrong) {
      return 'This form/field has a form-level error'
    }
    // To clear any errors:
    return false
  },
}
```

## Asynchronous Validation

Asynchronous validation is as easy as returning a promise that resolves to the standard return types shown above in the synchronous validation example:

```js
const options = {
  validate: async value => {
    const error = await validateOnServer(values)

    if (error) {
      return error
    }

    return false
  },
}
```

## Mixed Sync + Async Validation:

You also mix both synchronous and asynchronous validation easily with this pattern as well:

```js
const options = {
  validate: async value => {
    // First check for synchronous errors
    if (!values.foo || !values.bar) {
      return 'Foo and bar are required!'
    }

    // Then return a promise that resolves any async errors
    const error = await validateOnServer(values)
    return error ? error : false
  },
}
```

## Debouncing Form Validation

If you're validation is firing too often, you can debounce any stage of your validation function (sync or async) with React Form's built-in debounce utility. `instance.debounce` returns a promise that only resolves for the latest call after a given amount of time. This way, any outdated validation attempts are discarded automatically.

## Sync Debouncing

To debounce synchronous validation, return the promise from `debounce`, called with a synchronous function:

```js
const options = {
  validate: (values, instance) => {
    return instance.debounce(() => {
      // Wait 1000 milliseconds before validating anything
      if (!values.foo || !values.bar) {
        return 'Foo and bar are required!'
      }

      return false
    }, 1000)
  },
}
```

## Async Debouncing

To debounce asynchronous validation, return the promise from `debounce`, called with an asynchronous function:

```js
const options = {
  validate: async (values, instance) => {
    return instance.debounce(async () => {
      // Wait 2 seconds before validating on the server
      const error = await validateOnServer(values)
      return error ? error : false
    }, 2000)
  },
}
```

## Mixed Sync/Async Debouncing

Again, you can mix both sync/async and immediate/debounced behavior however you'd like!

> **Pro Tip**: This is my favorite and recommended approach to mixed validation.

```js
const options = {
  validate: async (values, instance) => {
    // Check for synchronous errors immediately without debouncing them
    if (!values.foo || !values.bar) {
      return 'Foo and bar are required!'
    }

    // Then, if sync validation passes
    return instance.debounce(() => {
      // Wait 2 seconds before validating on the server
      const error = await validateOnServer(values)
      return error ? error : false
    }, 2000)
  }
}
```

### Manually manage form `meta` and field `meta`

Returning an error string or false from validate is simply shorthand for setting/unsetting the `error` property on either the form's `instance.meta` object or a field's `meta` object. If you don't want to set an error and would rather set a success or warning message, you can use the `instance.setMeta` (for form-level validation) or the `instance.setMeta` function (for field-level validation). More than just the error field can be set/used on both the `instance.meta` object and each individual field's `meta` object. You could use this meta information for success messages, warnings, or any other information about a field. Only the `error` and `isTouched` meta properties are used internally by React Form to determine form validity.

```js
const options = {
  validate: async (values, instance) => {
    const serverError = await validateOnServer(values)

    if (serverError) {
      setMeta({
        error: serverError,
        message: null,
        errorStack: serverError.stack,
      })
    } else {
      setMeta({
        error: null,
        message: 'The form is good to be submitted!',
        errorStack: null,
      })
    }

    // Make sure this function returns undefined if you are handling
    // meta manually.
  },
}
```

Using this approach, you can avoid having to compose deeply nested field names!
