import type { AnyFormApi, FormApi, FormErrorTypes } from '@tanstack/form-core'
import type { FunctionComponent } from 'react'
import type { ReactTanStackFormComponents } from './Components.public'
import type { AnyReactFormComponentMap } from '../AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormApi<TFormData, TFormErrorTypes> &
  ReactTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents>

export type ReactFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyReactFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

export type AnyReactFormApi = AnyFormApi &
  ReactTanStackFormComponents<any, any, any>

export type { ReactFormComponentMap } from '../AppForm/componentMap.public'
