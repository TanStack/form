import { attachSvelteFormComponents } from '../createForm.svelte'
import { withComponentProps } from '../utils.lib.js'
import AppForm from './AppForm.svelte'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { Component } from 'svelte'
import type { AnySvelteFormComponentMap } from './componentMap.public'
import type { SvelteAppFormApi } from './SvelteAppFormApi.public'

type AnySvelteAppFormApi = SvelteAppFormApi<any, any, AnySvelteFormComponentMap>

export function attachSvelteAppFormComponents(
  form: AnyInternalFormApi,
  formComponents: Record<string, Component<any>>,
  fieldComponents: Record<string, Component<any>>,
): AnySvelteAppFormApi {
  const result = attachSvelteFormComponents(
    form,
    fieldComponents,
  ) as never as AnySvelteAppFormApi

  result.AppForm = ((internals: any, props: any) =>
    AppForm(
      internals,
      withComponentProps(props, { form: result }),
    )) as Component<any>

  return Object.assign(result, formComponents)
}
