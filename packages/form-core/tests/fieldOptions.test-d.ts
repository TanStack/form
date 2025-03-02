import { assertType, describe, it } from 'vitest'
import {
  FieldApi,
  FormApi,
  dynamicFieldOptions,
  fieldOptions,
  formOptions,
} from '../src'
import type {
  FieldOptionsExcludingForm,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '../src'

const defaultValues = {
  fullName: '',
  interests: [
    {
      name: '',
      level: 0,
    },
  ],
}

describe('fieldOptions type results', () => {
  it('should allow static field options', () => {
    const options = fieldOptions({
      formOptions: { ...formOptions({ defaultValues }) },
      fieldOptions: {
        name: 'fullName',
        defaultValue: 'John',
      },
    })

    type ExpectedType<TSubmitMeta> = FieldOptionsExcludingForm<
      typeof defaultValues,
      FormValidateOrFn<typeof defaultValues> | undefined, // TOnMount
      FormValidateOrFn<typeof defaultValues> | undefined, // TOnChange
      FormAsyncValidateOrFn<typeof defaultValues> | undefined, // TOnChangeAsync
      FormValidateOrFn<typeof defaultValues> | undefined, // TOnBlur
      FormAsyncValidateOrFn<typeof defaultValues> | undefined, // TOnBlurAsync
      FormValidateOrFn<typeof defaultValues> | undefined, // TOnSubmit
      FormAsyncValidateOrFn<typeof defaultValues> | undefined, // TOnSubmitAsync
      FormAsyncValidateOrFn<typeof defaultValues> | undefined, // TOnServer
      TSubmitMeta,
      'fullName'
    >

    // Assert that the options match the expected type
    assertType<ExpectedType<any>>(options)
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

    assertType<
      FieldOptionsExcludingForm<
        typeof complexDefaultValues,
        FormValidateOrFn<typeof complexDefaultValues> | undefined,
        FormValidateOrFn<typeof complexDefaultValues> | undefined,
        FormAsyncValidateOrFn<typeof complexDefaultValues> | undefined,
        FormValidateOrFn<typeof complexDefaultValues> | undefined,
        FormAsyncValidateOrFn<typeof complexDefaultValues> | undefined,
        FormValidateOrFn<typeof complexDefaultValues> | undefined,
        FormAsyncValidateOrFn<typeof complexDefaultValues> | undefined,
        FormAsyncValidateOrFn<typeof complexDefaultValues> | undefined,
        any,
        `user.profile.addresses[${number}].zipCode`
      >
    >(options(0))
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

    type ExpectedType<TSubmitMeta> = FieldOptionsExcludingForm<
      typeof defaultValues,
      FormValidateOrFn<typeof defaultValues> | undefined, // TOnMount
      FormValidateOrFn<typeof defaultValues> | undefined, // TOnChange
      FormAsyncValidateOrFn<typeof defaultValues> | undefined, // TOnChangeAsync
      FormValidateOrFn<typeof defaultValues> | undefined, // TOnBlur
      FormAsyncValidateOrFn<typeof defaultValues> | undefined, // TOnBlurAsync
      FormValidateOrFn<typeof defaultValues> | undefined, // TOnSubmit
      FormAsyncValidateOrFn<typeof defaultValues> | undefined, // TOnSubmitAsync
      FormAsyncValidateOrFn<typeof defaultValues> | undefined, // TOnServer
      TSubmitMeta,
      `interests[${number}].name`
    >

    // Assert that the options match the expected type
    assertType<ExpectedType<any>>(options(0))
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
