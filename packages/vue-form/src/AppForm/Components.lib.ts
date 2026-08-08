import { defineComponent, provide } from 'vue'
import { attachVueFormComponents } from '../VueForm/Components.lib'
import { FieldContext, FormContext } from './contexts.lib'
import type { Component } from 'vue'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { AnyVueFormComponentMap } from './componentMap.public'
import type { VueAppFormApi } from './VueAppFormApi.public'

type AnyVueAppFormApi = VueAppFormApi<any, any, AnyVueFormComponentMap>

export function attachVueAppFormComponents(
  form: AnyInternalFormApi,
  formComponents: Record<string, Component>,
  fieldComponents: Record<string, Component>,
): AnyVueAppFormApi {
  const resultForm = attachVueFormComponents(
    form,
    fieldComponents,
    FieldContext,
  ) as never as AnyVueAppFormApi

  resultForm.AppForm = defineComponent(
    (_props, { slots }) => {
      provide(FormContext, resultForm as never)
      return () => slots.default?.()
    },
    { name: 'TanStackForm.AppForm' },
  ) as never

  return Object.assign(resultForm, formComponents)
}
