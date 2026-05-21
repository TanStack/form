import type {
  AnyFormApi,
  FormApi,
  FormValidators,
} from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'
import type { ReactTanStackFormComponents } from './Components.public'

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
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = ExtendedFormApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFieldComponents
> &
  TFormComponents

export type AnyReactFormApi = AnyFormApi &
  ReactTanStackFormComponents<any, any, any, any>
