import type {
  AnyFormApi,
  FormApi,
  FormValidators,
} from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'
import type { ReactTanStackFormComponents } from './Components.public'
import type { AnyReactFormComponentMap } from '../AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormApi<TFormData, TFormValidators, TSubmitReturn> &
  ReactTanStackFormComponents<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >

export type ReactFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TComponents extends AnyReactFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TComponents['fieldComponents']
    >
  : ExtendedFormApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

export type AnyReactFormApi = AnyFormApi &
  ReactTanStackFormComponents<any, any, any, any>

export type { ReactFormComponentMap } from '../AppForm/componentMap.public'
