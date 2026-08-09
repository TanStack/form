import type {
  AnyFormApi,
  FormApi,
  FormErrorTypes,
  FormState,
} from '@tanstack/form-core'
import type { Component } from 'svelte'
import type { SvelteTanStackFormComponents } from './Components.public'
import type {
  AnySvelteFormComponentMap,
  DefaultSvelteFormComponentMap,
} from './AppForm/componentMap.public'

export interface SvelteFormSelectors<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> {
  useSelector: <TSelected = FormState<TFormData, TFormErrorTypes>>(
    selector?: (state: FormState<TFormData, TFormErrorTypes>) => TSelected,
  ) => { readonly current: TSelected }
}

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = FormApi<TFormData, TFormErrorTypes> &
  SvelteTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents> &
  SvelteFormSelectors<TFormData, TFormErrorTypes>

export type SvelteFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnySvelteFormComponentMap = DefaultSvelteFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

export type AnySvelteFormApi = AnyFormApi &
  SvelteTanStackFormComponents<any, any, any> &
  SvelteFormSelectors<any, any>

export type { SvelteFormComponentMap } from './AppForm/componentMap.public'
