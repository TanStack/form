import type { AnyFormApi, FormApi, FormErrorTypes } from '@tanstack/form-core'
import type { Component } from 'solid-js'
import type { SolidTanStackFormComponents } from './Components.public'
import type {
  AnySolidFormComponentMap,
  DefaultSolidFormComponentMap,
} from './AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = FormApi<TFormData, TFormErrorTypes> &
  SolidTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents>

export type SolidFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnySolidFormComponentMap = DefaultSolidFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

export type AnySolidFormApi = AnyFormApi &
  SolidTanStackFormComponents<any, any, any>

export type { SolidFormComponentMap } from './AppForm/componentMap.public'
