import { describe, expect, it } from 'vitest'
import {
  FieldApi,
  FormApi,
  dynamicFieldOptions,
  fieldOptions,
  formOptions,
} from '../src'

/**
 * Default values shared for test cases.
 */
const defaultValues = {
  fullName: '',
  interests: [
    { interestName: 'Interest 1', interestLevel: 0 },
    { interestName: 'Interest 2', interestLevel: 0 },
  ],
}

describe('fieldOptions', () => {
  it('clears errors on all fields affected by form validation when condition resolves using fieldConfigs', () => {
    // Setup form with formOptions
    const formOpts = formOptions({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
      validators: {
        onChange: ({ value }) => {
          if (value.firstName && value.lastName) {
            return {
              fields: {
                firstName: 'Do not enter both firstName and lastName',
                lastName: 'Do not enter both firstName and lastName',
              },
            }
          }
          return null
        },
      },
    })

    const firstNameFieldOpts = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: { name: 'firstName' },
    })

    const lastNameFieldOpts = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: { name: 'lastName' },
    })

    const form = new FormApi({
      ...formOpts,
    })
    form.mount()

    const firstNameField = new FieldApi({
      form,
      ...firstNameFieldOpts,
    })
    firstNameField.mount()

    const lastNameField = new FieldApi({
      form,
      ...lastNameFieldOpts,
    })
    lastNameField.mount()

    // Set values to trigger validation errors
    firstNameField.setValue('John')
    lastNameField.setValue('Doe')

    // Verify both fields have errors
    expect(firstNameField.state.meta.errors).toContain(
      'Do not enter both firstName and lastName',
    )
    expect(lastNameField.state.meta.errors).toContain(
      'Do not enter both firstName and lastName',
    )

    // Clear one field's value
    firstNameField.setValue('')

    // Verify both fields have their errors cleared
    expect(firstNameField.state.meta.errors).toStrictEqual([])
    expect(lastNameField.state.meta.errors).toStrictEqual([])

    // Verify previous error map still contains values for the fields as it should indicate the last error map processed for the fields
    const cumulativeFieldsErrorMap = form.cumulativeFieldsErrorMap
    expect(cumulativeFieldsErrorMap.firstName).toBeDefined()
    expect(cumulativeFieldsErrorMap.lastName).toBeDefined()
    expect(cumulativeFieldsErrorMap.firstName?.onChange).toBeUndefined()
    expect(cumulativeFieldsErrorMap.lastName?.onChange).toBeUndefined()
  })

  it('should run validations defined at form level', () => {
    const formOpts = formOptions({
      defaultValues,
      validators: {
        onChange: ({ value }) => {
          if (value.fullName.length < 3) {
            return {
              fields: {
                fullName: 'Full name must be at least 3 characters long',
              },
            }
          }
          return null
        },
      },
    })

    const form = new FormApi({
      ...formOpts,
    })
    form.mount()

    const fieldOpts = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: { name: 'fullName' },
    })

    const field = new FieldApi({
      form,
      ...fieldOpts,
    })
    field.mount()

    field.setValue('')

    expect(field.state.meta.errors).toContain(
      'Full name must be at least 3 characters long',
    )
  })

  it('should run validations defined at field level', () => {
    const formOpts = formOptions({
      defaultValues,
    })

    const form = new FormApi({
      ...formOpts,
    })
    form.mount()

    const fieldOpts = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: 'fullName',
        validators: {
          onChange: ({ value }) => {
            if (value.length < 3) {
              return 'Full name must be at least 3 characters long'
            }
            return null
          },
        },
      },
    })

    const field = new FieldApi({
      form,
      ...fieldOpts,
    })
    field.mount()

    field.setValue('')

    expect(field.state.meta.errors).toContain(
      'Full name must be at least 3 characters long',
    )
  })
})

describe('dynamicFieldOptions', () => {
  it('clears previous form level errors for subfields when they are no longer valid using fieldOptions', () => {
    // Setup form with formOptions
    const formOpts = formOptions({
      defaultValues,
      validators: {
        onChange: ({ value }) => {
          const interestNames = value.interests.map(
            (interest) => interest.interestName,
          )
          const uniqueInterestNames = new Set(interestNames)

          if (uniqueInterestNames.size !== interestNames.length) {
            return {
              fields: {
                interests: 'No duplicate interests allowed',
              },
            }
          }

          return null
        },
      },
    })

    const form = new FormApi({
      ...formOpts,
    })
    form.mount()

    // Create options for the interests array field
    const interestsFieldOpts = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: { name: 'interests' },
    })

    const interestsField = new FieldApi({
      form,
      ...interestsFieldOpts,
    })
    interestsField.mount()

    // Create dynamic options for the individual interest fields
    const interestNameOpts = dynamicFieldOptions((index: number) => ({
      formOptions: { ...formOpts },
      fieldOptions: { name: `interests[${index}].interestName` },
    }))

    const interestName0 = new FieldApi({
      form,
      ...interestNameOpts(0),
    })
    interestName0.mount()

    const interestName1 = new FieldApi({
      form,
      ...interestNameOpts(1),
    })
    interestName1.mount()

    // When creating a duplicate interest via form level validator
    interestName1.setValue('Interest 1')
    expect(interestsField.state.meta.errors).toStrictEqual([
      'No duplicate interests allowed',
    ])

    // When fixing the duplicate interest via form level validator
    interestName1.setValue('Interest 2')
    expect(interestsField.state.meta.errors).toStrictEqual([])
  })

  it('should run listeners defined on fieldOptions', () => {
    const formOpts = formOptions({
      defaultValues,
    })

    const form = new FormApi({
      ...formOpts,
    })
    form.mount()

    const interestsFieldOpts = fieldOptions({
      formOptions: { ...formOpts },
      fieldOptions: { name: 'interests' },
    })

    const interestsField = new FieldApi({
      form,
      ...interestsFieldOpts,
    })
    interestsField.mount()

    const interestNameOpts = dynamicFieldOptions((index: number) => ({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: `interests[${index}].interestName`,
      },
    }))

    const interestName0 = new FieldApi({
      form,
      ...interestNameOpts(0),
    })
    interestName0.mount()

    const interestLevelOpts = dynamicFieldOptions((index: number) => ({
      formOptions: { ...formOpts },
      fieldOptions: {
        name: `interests[${index}].interestLevel`,
        listeners: {
          onChange: ({ value, fieldApi }) => {
            if (value > 9000) {
              fieldApi.form.setFieldValue('fullName', 'vegeta')
            }
          },
        },
      },
    }))

    const interestLevel0 = new FieldApi({
      form,
      ...interestLevelOpts(0),
    })
    interestLevel0.mount()

    interestLevel0.setValue(9001)

    // Verify fullName is set to vegeta
    expect(form.state.values.fullName).toBe('vegeta')
  })
})
