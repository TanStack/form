import Preact from 'preact/compat'
import { useForm } from '../src'
import type { AnyFieldApi, AnyFormApi, ValidationIssue } from '../src'

interface FormValidationIssue extends ValidationIssue {
  source: 'form'
}

interface FormFieldValidationIssue extends ValidationIssue {
  source: 'form-field'
}

interface GroupValidationIssue extends ValidationIssue {
  source: 'group'
}

interface GroupFieldValidationIssue extends ValidationIssue {
  source: 'group-field'
}

interface FieldValidationIssue extends ValidationIssue {
  source: 'field'
}

const defaultValues = {
  section: {
    name: '',
  },
}

const formValidator = {
  triggers: [],
  run: () => ({
    form: {
      message: 'Form error',
      source: 'form' as const,
    } satisfies FormValidationIssue,
    fields: {
      'section.name': {
        message: 'Form field error',
        source: 'form-field' as const,
      } satisfies FormFieldValidationIssue,
    },
  }),
}

const formOnlyValidator = {
  triggers: [],
  run: () => ({
    form: {
      message: 'Form error',
      source: 'form' as const,
    } satisfies FormValidationIssue,
    fields: {},
  }),
}

const formFieldOnlyValidator = {
  triggers: [],
  run: () => ({
    fields: {
      'section.name': {
        message: 'Form field error',
        source: 'form-field' as const,
      } satisfies FormFieldValidationIssue,
    },
  }),
}

const groupValidator = {
  triggers: [],
  run: () => ({
    form: {
      message: 'Group error',
      source: 'group' as const,
    } satisfies GroupValidationIssue,
    fields: {
      name: {
        message: 'Group field error',
        source: 'group-field' as const,
      } satisfies GroupFieldValidationIssue,
    },
  }),
}

const fieldValidator = {
  triggers: [],
  run: () =>
    ({
      message: 'Field error',
      source: 'field' as const,
    }) satisfies FieldValidationIssue,
}

declare function acceptAnyFormApi(form: AnyFormApi): void
declare function acceptAnyFieldApi(field: AnyFieldApi): void

function AnyApiAssignabilityMatrix() {
  const formWithFormAndFieldErrors = useForm({
    defaultValues,
    validators: [formValidator],
    onSubmit: () => undefined,
  })
  const formWithOnlyFormErrors = useForm({
    defaultValues,
    validators: [formOnlyValidator],
    onSubmit: () => undefined,
  })
  const formWithOnlyFieldErrors = useForm({
    defaultValues,
    validators: [formFieldOnlyValidator],
    onSubmit: () => undefined,
  })
  const formWithoutErrors = useForm({
    defaultValues,
    validators: [],
    onSubmit: () => undefined,
  })

  acceptAnyFormApi(formWithFormAndFieldErrors)
  acceptAnyFormApi(formWithOnlyFormErrors)
  acceptAnyFormApi(formWithOnlyFieldErrors)
  acceptAnyFormApi(formWithoutErrors)

  return (
    <>
      <formWithFormAndFieldErrors.FormGroup
        name="section"
        validators={[groupValidator]}
      >
        {(group) => (
          <>
            {/* Form, group, and field validators produce errors. */}
            <group.Field name="name" validators={[fieldValidator]}>
              {(field) => {
                acceptAnyFieldApi(field)
                return null
              }}
            </group.Field>
            {/* The field validator omits its error. */}
            <group.Field name="name">
              {(field) => {
                acceptAnyFieldApi(field)
                return null
              }}
            </group.Field>
          </>
        )}
      </formWithFormAndFieldErrors.FormGroup>

      <formWithFormAndFieldErrors.FormGroup name="section">
        {(group) => (
          <>
            {/* The group validator omits its error. */}
            <group.Field name="name" validators={[fieldValidator]}>
              {(field) => {
                acceptAnyFieldApi(field)
                return null
              }}
            </group.Field>
            {/* The group and field validators omit their errors. */}
            <group.Field name="name">
              {(field) => {
                acceptAnyFieldApi(field)
                return null
              }}
            </group.Field>
          </>
        )}
      </formWithFormAndFieldErrors.FormGroup>

      <formWithoutErrors.FormGroup name="section" validators={[groupValidator]}>
        {(group) => (
          <>
            {/* The form validator omits its error. */}
            <group.Field name="name" validators={[fieldValidator]}>
              {(field) => {
                acceptAnyFieldApi(field)
                return null
              }}
            </group.Field>
            {/* The form and field validators omit their errors. */}
            <group.Field name="name">
              {(field) => {
                acceptAnyFieldApi(field)
                return null
              }}
            </group.Field>
          </>
        )}
      </formWithoutErrors.FormGroup>

      <formWithoutErrors.FormGroup name="section">
        {(group) => (
          <>
            {/* The form and group validators omit their errors. */}
            <group.Field name="name" validators={[fieldValidator]}>
              {(field) => {
                acceptAnyFieldApi(field)
                return null
              }}
            </group.Field>
            {/* All validator levels omit their errors. */}
            <group.Field name="name">
              {(field) => {
                acceptAnyFieldApi(field)
                return null
              }}
            </group.Field>
          </>
        )}
      </formWithoutErrors.FormGroup>
    </>
  )
}

void AnyApiAssignabilityMatrix
