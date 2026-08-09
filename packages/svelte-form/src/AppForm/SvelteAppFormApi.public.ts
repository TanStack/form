import type { FormErrorTypes } from '@tanstack/form-core'
import type { Component, Snippet } from 'svelte'
import type { SvelteFormApi } from '../formApiTypes.public'
import type { AnySvelteFormComponentMap } from './componentMap.public'

export type AppFormComponent = Component<{ children: Snippet }>

export type SvelteAppFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnySvelteFormComponentMap,
> = SvelteFormApi<TFormData, TFormErrorTypes, TComponents> & {
  AppForm: AppFormComponent
}
