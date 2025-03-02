import { assertType, describe, it } from 'vitest'
import {
  FieldApi,
  FormApi,
  dynamicFieldOptions,
  fieldOptions,
  formOptions,
} from '../src'
import type {
  DeepKeys,
  DeepValue,
  FieldApiOptionsExcludingForm,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '../src'

/**
 * Default values shared for test cases.
 */
const defaultValues = {
  fullName: '',
  interests: [
    {
      name: '',
      level: 0,
    },
  ],
}

/**
 * This type is used to build the expected type for the field options.
 */
type CreateExpectedFieldOptionsType<
  TValues,
  TName extends DeepKeys<TValues>,
  TSubmitMeta = any,
> = FieldApiOptionsExcludingForm<
  TValues,
  FormValidateOrFn<TValues> | undefined, // TOnMount
  FormValidateOrFn<TValues> | undefined, // TOnChange
  FormAsyncValidateOrFn<TValues> | undefined, // TOnChangeAsync
  FormValidateOrFn<TValues> | undefined, // TOnBlur
  FormAsyncValidateOrFn<TValues> | undefined, // TOnBlurAsync
  FormValidateOrFn<TValues> | undefined, // TOnSubmit
  FormAsyncValidateOrFn<TValues> | undefined, // TOnSubmitAsync
  FormAsyncValidateOrFn<TValues> | undefined, // TOnServer
  TSubmitMeta,
  TName,
  undefined | FieldValidateOrFn<TValues, TName, DeepValue<TValues, TName>>, // TFieldOnMount
  undefined | FieldValidateOrFn<TValues, TName, DeepValue<TValues, TName>>, // TFieldOnChange
  undefined | FieldAsyncValidateOrFn<TValues, TName, DeepValue<TValues, TName>>, // TFieldOnChangeAsync
  undefined | FieldValidateOrFn<TValues, TName, DeepValue<TValues, TName>>, // TFieldOnBlur
  undefined | FieldAsyncValidateOrFn<TValues, TName, DeepValue<TValues, TName>>, // TFieldOnBlurAsync
  undefined | FieldValidateOrFn<TValues, TName, DeepValue<TValues, TName>>, // TFieldOnSubmit
  undefined | FieldAsyncValidateOrFn<TValues, TName, DeepValue<TValues, TName>> // TFieldOnSubmitAsync
>

describe('fieldOptions type results', () => {
  it('should allow static field options', () => {
    const options = fieldOptions({
      formOptions: { ...formOptions({ defaultValues }) },
      fieldOptions: {
        name: 'fullName',
        defaultValue: 'John',
      },
    })

    type ExpectedType = CreateExpectedFieldOptionsType<
      typeof defaultValues,
      'fullName'
    >

    // Assert that the options match the expected type
    assertType<ExpectedType>(options)
  })

  it('should type complex nested paths correctly', () => {
    const complexDefaultValues = {
      user: {
        profile: {
          addresses: [
            {
              street: '',
              city: '',
              zipCode: 0,
            },
          ],
          preferences: {
            notifications: {
              email: false,
              sms: false,
            },
          },
        },
      },
    }

    const options = dynamicFieldOptions((idx: number) => ({
      formOptions: { ...formOptions({ defaultValues: complexDefaultValues }) },
      fieldOptions: { name: `user.profile.addresses[${idx}].zipCode` },
    }))

    type ExpectedType = CreateExpectedFieldOptionsType<
      typeof complexDefaultValues,
      `user.profile.addresses[${number}].zipCode`
    >

    assertType<ExpectedType>(options(0))
  })

  it('should respect error types from form level', () => {
    const formOpts = formOptions({
      defaultValues,
      validators: {
        onChange: () => {
          return {
            fields: {
              fullName: 'too short',
            },
          }
        },
      },
    })

    const options = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: 'fullName',
      },
    })

    const form = new FormApi({ ...formOpts })
    const FullNameField = new FieldApi({
      form,
      ...options,
    })

    const errors = FullNameField.state.meta.errors

    assertType<Array<string | number | undefined>>(errors)

    // These push statements would not be allowed if errors object was inferred as undefined[], assertType doesn't do strict type checking.
    errors.push('asdf') // Allows pushing string indicating that string errors are allowed
  })

  it('should respect error types from field level', () => {
    const formOpts = formOptions({
      defaultValues,
    })

    const options = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: 'fullName',
        validators: { onChange: () => 1000 },
      },
    })

    const form = new FormApi({ ...formOpts })
    const FullNameField = new FieldApi({
      form,
      ...options,
    })

    const errors = FullNameField.state.meta.errors

    // These push statements would not be allowed if errors object was inferred as undefined[], assertType doesn't do strict type checking.
    assertType<Array<string | number | undefined>>(errors)
    errors.push(1000) // Allows pushing number indicating that number errors are allowed
  })

  it('should respect error types from both form and field level', () => {
    const formOpts = formOptions({
      defaultValues,
      validators: {
        onChange: ({ value }) => {
          if (value.fullName.length < 3) {
            return {
              fields: {
                fullName: 'too short', // String at form level
              },
            }
          }
          return null
        },
      },
    })

    const options = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: 'fullName',
        validators: {
          onChange: () => {
            return 1000 // Number return type at field level
          },
        },
      },
    })

    const form = new FormApi({ ...formOpts })
    const FullNameField = new FieldApi({
      form,
      ...options,
    })

    type ExpectedType = Array<number | string | undefined>
    const errors = FullNameField.state.meta.errors

    assertType<ExpectedType>(errors)

    // These push statements would not be allowed if errors object was inferred as undefined[], assertType doesn't do strict type checking.
    errors.push('asdf') // Allows pushing string indicating that string errors are allowed
    errors.push(1000) // Allows pushing number indicating that number errors are allowed
  })
})

describe('dynamicFieldOptions', () => {
  it('should allow dynamic field options', () => {
    const options = dynamicFieldOptions((idx: number) => ({
      formOptions: { ...formOptions({ defaultValues }) },
      fieldOptions: { name: `interests[${idx}].name` },
    }))

    type ExpectedType = CreateExpectedFieldOptionsType<
      typeof defaultValues,
      `interests[${number}].name`
    >

    // Assert that the options match the expected type
    assertType<ExpectedType>(options(0))
  })

  it('should respect error types from form level with dynamicFieldOptions', () => {
    const formOpts = formOptions({
      defaultValues,
      validators: {
        onChange: () => {
          return {
            fields: {
              fullName: 'too short',
            },
          }
        },
      },
    })

    const fieldOpts = dynamicFieldOptions((_) => ({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: 'fullName',
      },
    }))

    const form = new FormApi({ ...formOpts })
    const InterestNameField = new FieldApi({
      form,
      ...fieldOpts(undefined),
    })

    const errors = InterestNameField.state.meta.errors

    assertType<Array<string | number | undefined>>(errors)

    // These push statements would not be allowed if errors object was inferred as undefined[], assertType doesn't do strict type checking.
    errors.push('asdf') // Allows pushing string indicating that string errors are allowed
  })

  it('should respect error types from field level with dynamicFieldOptions', () => {
    const formOpts = formOptions({
      defaultValues,
    })

    const options = dynamicFieldOptions((idx: number) => ({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: `interests[${idx}].name`,
        validators: { onChange: () => 1000 },
      },
    }))

    const form = new FormApi({ ...formOpts })
    const InterestNameField = new FieldApi({
      form,
      ...options(0),
    })

    const errors = InterestNameField.state.meta.errors

    assertType<Array<string | number | undefined>>(errors)
    errors.push(1000) // Allows pushing number indicating that number errors are allowed
  })

  it('should respect error types from both form and field level', () => {
    const formOpts = formOptions({
      defaultValues,
      validators: {
        onChange: ({ value }) => {
          if (value.fullName.length < 3) {
            return {
              fields: {
                fullName: 'too short', // String at form level
              },
            }
          }
          return null
        },
      },
    })

    const fieldOpts = dynamicFieldOptions((_) => ({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: 'fullName',
        validators: {
          onChange: () => {
            return 1000 // Number return type at field level
          },
        },
      },
    }))

    const form = new FormApi({ ...formOpts })
    const FullNameField = new FieldApi({
      form,
      ...fieldOpts(undefined),
    })

    type ExpectedType = Array<number | string | undefined>
    const errors = FullNameField.state.meta.errors

    assertType<ExpectedType>(errors)

    // These push statements would not be allowed if errors object was inferred as undefined[], assertType doesn't do strict type checking.
    errors.push('asdf') // Allows pushing string indicating that string errors are allowed
    errors.push(1000) // Allows pushing number indicating that number errors are allowed
  })
})
