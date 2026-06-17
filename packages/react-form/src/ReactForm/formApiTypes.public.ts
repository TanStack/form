import type {
  AnyFormApi,
  FormApi,
  FormValidatorMetas,
} from '@tanstack/form-core'
import type { FunctionComponent } from 'react'
import type { ReactTanStackFormComponents } from './Components.public'
import type { AnyReactFormComponentMap } from '../AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormApi<TFormData, TFormValidatorMetas, TSubmitReturn> &
  ReactTanStackFormComponents<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >

export type ReactFormApi<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TComponents extends AnyReactFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<
      TFormData,
      TFormValidatorMetas,
      TSubmitReturn,
      TComponents['fieldComponents']
    >
  : ExtendedFormApi<
      TFormData,
      TFormValidatorMetas,
      TSubmitReturn,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

export type AnyReactFormApi = AnyFormApi &
  ReactTanStackFormComponents<any, any, any, any>

export type { ReactFormComponentMap } from '../AppForm/componentMap.public'
