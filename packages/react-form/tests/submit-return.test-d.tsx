import React from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { createFormHook, formOptions, useForm } from '../src'
import type { ReactFormType, ValidationIssue } from '../src'

describe('submit return', () => {
  describe('formOptions', () => {
    it('should allow shared options to omit onSubmit', () => {
      const sharedOptionsWithoutSubmit = formOptions({
        defaultValues: { email: '' },
        validators: [],
      })

      type SharedFormWithoutSubmit = ReactFormType<
        typeof sharedOptionsWithoutSubmit
      >

      function SharedFormChild(props: { form: SharedFormWithoutSubmit }) {
        const { form } = props

        return (
          <form.Field name="email">
            {(field) => {
              expectTypeOf(field.errors).toEqualTypeOf<Array<ValidationIssue>>()
              return null
            }}
          </form.Field>
        )
      }

      function ParentWithSubmitInComponent() {
        const formWithSyncError = useForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: ({ createValidationError }) => {
            if (Math.random() > 0.5) {
              return createValidationError({
                fields: {
                  email: { message: '', fromSubmit: true },
                },
              })
            }
            return null
          },
        })

        const formWithAsyncError = useForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: ({ createValidationError }) =>
            Promise.resolve(
              createValidationError({
                fields: {
                  email: { message: '', fromSubmit: true },
                },
              }),
            ),
        })

        const formWithoutError = useForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: () => Promise.resolve(null),
        })
        const formUnchanged = useForm(sharedOptionsWithoutSubmit)

        expectTypeOf(formWithSyncError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formWithAsyncError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formWithoutError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formUnchanged).toExtend<SharedFormWithoutSubmit>()

        return (
          <>
            <SharedFormChild form={formWithSyncError} />
            <SharedFormChild form={formWithAsyncError} />
            <SharedFormChild form={formWithoutError} />
            <SharedFormChild form={formUnchanged} />
          </>
        )
      }

      void ParentWithSubmitInComponent
    })

    it('should allow options to include onSubmit, strictly matching it', () => {
      const sharedOptionsWithSubmit = formOptions({
        defaultValues: { email: '' },
        validators: [],
        onSubmit: ({ createValidationError }) =>
          createValidationError({
            form: { message: '', code: 'form' as const },
            fields: {
              email: { message: '', code: 'email' as const },
            },
          }),
      })

      type SharedFormWithSubmit = ReactFormType<typeof sharedOptionsWithSubmit>

      function ParentWithAsyncSubmitInComponent() {
        const formWithSyncError = useForm({
          ...sharedOptionsWithSubmit,
          onSubmit: ({ createValidationError }) => {
            if (Math.random() > 0.5) {
              return createValidationError({
                form: { message: '', code: 'form' as const },
                fields: {
                  email: { message: '', code: 'email' as const },
                },
              })
            }
            return null
          },
        })

        const formWithAsyncError = useForm({
          ...sharedOptionsWithSubmit,
          onSubmit: ({ createValidationError }) =>
            Promise.resolve(
              createValidationError({
                fields: {
                  email: { message: '', fromSubmit: true },
                },
              }),
            ),
        })

        const formWithoutError = useForm({
          ...sharedOptionsWithSubmit,
          onSubmit: () => Promise.resolve(null),
        })
        const formUnchanged = useForm(sharedOptionsWithSubmit)

        expectTypeOf(formWithSyncError).toExtend<SharedFormWithSubmit>()
        expectTypeOf(formWithAsyncError).not.toExtend<SharedFormWithSubmit>()
        expectTypeOf(formWithoutError).not.toExtend<SharedFormWithSubmit>()
        expectTypeOf(formUnchanged).toExtend<SharedFormWithSubmit>()
      }

      void ParentWithAsyncSubmitInComponent
    })
  })

  describe('appFormOptions', () => {
    const { appFormOptions, useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
    })

    it('should allow shared options to omit onSubmit', () => {
      const sharedOptionsWithoutSubmit = appFormOptions({
        defaultValues: { email: '' },
        validators: [],
      })

      type SharedFormWithoutSubmit = ReactFormType<
        typeof sharedOptionsWithoutSubmit
      >

      function SharedFormChild(props: { form: SharedFormWithoutSubmit }) {
        const { form } = props

        return (
          <form.Field name="email">
            {(field) => {
              expectTypeOf(field.errors).toEqualTypeOf<Array<ValidationIssue>>()
              return null
            }}
          </form.Field>
        )
      }

      function ParentWithSubmitInComponent() {
        const formWithSyncError = useAppForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: ({ createValidationError }) => {
            if (Math.random() > 0.5) {
              return createValidationError({
                fields: {
                  email: { message: '', fromSubmit: true },
                },
              })
            }
            return null
          },
        })

        const formWithAsyncError = useAppForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: ({ createValidationError }) =>
            Promise.resolve(
              createValidationError({
                fields: {
                  email: { message: '', fromSubmit: true },
                },
              }),
            ),
        })

        const formWithoutError = useAppForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: () => Promise.resolve(null),
        })
        const formUnchanged = useAppForm(sharedOptionsWithoutSubmit)

        expectTypeOf(formWithSyncError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formWithAsyncError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formWithoutError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formUnchanged).toExtend<SharedFormWithoutSubmit>()

        return (
          <>
            <SharedFormChild form={formWithSyncError} />
            <SharedFormChild form={formWithAsyncError} />
            <SharedFormChild form={formWithoutError} />
            <SharedFormChild form={formUnchanged} />
          </>
        )
      }

      void ParentWithSubmitInComponent
    })

    it('should allow options to include onSubmit, strictly matching it', () => {
      const sharedOptionsWithSubmit = appFormOptions({
        defaultValues: { email: '' },
        validators: [],
        onSubmit: ({ createValidationError }) =>
          createValidationError({
            form: { message: '', code: 'form' as const },
            fields: {
              email: { message: '', code: 'email' as const },
            },
          }),
      })

      type SharedFormWithSubmit = ReactFormType<typeof sharedOptionsWithSubmit>

      function ParentWithAsyncSubmitInComponent() {
        const formWithSyncError = useAppForm({
          ...sharedOptionsWithSubmit,
          onSubmit: ({ createValidationError }) => {
            if (Math.random() > 0.5) {
              return createValidationError({
                form: { message: '', code: 'form' as const },
                fields: {
                  email: { message: '', code: 'email' as const },
                },
              })
            }
            return null
          },
        })

        const formWithAsyncError = useAppForm({
          ...sharedOptionsWithSubmit,
          onSubmit: ({ createValidationError }) =>
            Promise.resolve(
              createValidationError({
                fields: {
                  email: { message: '', fromSubmit: true },
                },
              }),
            ),
        })

        const formWithoutError = useAppForm({
          ...sharedOptionsWithSubmit,
          onSubmit: () => Promise.resolve(null),
        })
        const formUnchanged = useAppForm(sharedOptionsWithSubmit)

        expectTypeOf(formWithSyncError).toExtend<SharedFormWithSubmit>()
        expectTypeOf(formWithAsyncError).not.toExtend<SharedFormWithSubmit>()
        expectTypeOf(formWithoutError).not.toExtend<SharedFormWithSubmit>()
        expectTypeOf(formUnchanged).toExtend<SharedFormWithSubmit>()
      }

      void ParentWithAsyncSubmitInComponent
    })
  })
})
