import type { AnyFormApi, FormApi, FormErrorTypes } from '@tanstack/form-core'
import type { FunctionComponent } from 'preact/compat'
import type { PreactTanStackFormComponents } from './Components.public'
import type { AnyPreactFormComponentMap } from '../AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormApi<TFormData, TFormErrorTypes> &
  PreactTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents>

export type PreactFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyPreactFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

export type AnyPreactFormApi = AnyFormApi &
  PreactTanStackFormComponents<any, any, any>

export type { PreactFormComponentMap } from '../AppForm/componentMap.public'
