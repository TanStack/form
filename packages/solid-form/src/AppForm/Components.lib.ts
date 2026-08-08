import { createComponent, mergeProps } from 'solid-js'
import { attachSolidFormComponents } from '../SolidFormApi.lib'
import { createArrayField, createField } from '../createField.lib'
import { FieldContext, FormContext } from './contexts.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { Component } from 'solid-js'
import type { AnySolidFormComponentMap } from './componentMap.public'
import type { SolidAppFormApi } from './SolidAppFormApi.public'
import type { SolidFormFieldProps } from '../Components.public'

type AnySolidAppFormApi = SolidAppFormApi<any, any, AnySolidFormComponentMap>

export function attachSolidAppFormComponents(
  form: AnyInternalFormApi,
  formComponents: Record<string, Component<any>>,
  fieldComponents: Record<string, Component<any>>,
): AnySolidAppFormApi {
  const resultForm = attachSolidFormComponents(
    form,
    fieldComponents,
  ) as never as AnySolidAppFormApi

  resultForm.AppForm = function AppForm(props) {
    return createComponent(FormContext.Provider, {
      value: resultForm as never,
      get children() {
        return props.children
      },
    })
  }

  resultForm.Field = function TanStackFormField(
    props: SolidFormFieldProps<any, any, any, any, any, any, any, any>,
  ) {
    const fieldOptions = mergeProps(props, { form })
    const fieldApi = createField(() => fieldOptions as never)
    Object.assign(fieldApi, fieldComponents)

    return createComponent(FieldContext.Provider, {
      value: fieldApi as never,
      get children() {
        return props.children(fieldApi as never)
      },
    })
  } as never

  resultForm.ArrayField = function TanStackFormArrayField(
    props: SolidFormFieldProps<any, any, any, any, any, any, any, any>,
  ) {
    const fieldOptions = mergeProps(props, { form })
    const fieldApi = createArrayField(() => fieldOptions as never)
    Object.assign(fieldApi, fieldComponents)

    return createComponent(FieldContext.Provider, {
      value: fieldApi as never,
      get children() {
        return props.children(fieldApi as never)
      },
    })
  } as never

  return Object.assign(resultForm, formComponents)
}
