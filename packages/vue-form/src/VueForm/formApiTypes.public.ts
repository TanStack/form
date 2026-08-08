import type { AnyFormApi, FormApi, FormErrorTypes } from '@tanstack/form-core'
import type { Component } from 'vue'
import type { VueTanStackFormComponents } from './Components.public'
import type {
  AnyVueFormComponentMap,
  DefaultVueFormComponentMap,
} from '../AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component>,
> = FormApi<TFormData, TFormErrorTypes> &
  VueTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents>

export type VueFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyVueFormComponentMap = DefaultVueFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

export type AnyVueFormApi = AnyFormApi &
  VueTanStackFormComponents<any, any, any>

export type { VueFormComponentMap } from '../AppForm/componentMap.public'
