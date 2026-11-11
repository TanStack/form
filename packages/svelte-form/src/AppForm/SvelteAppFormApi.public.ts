import type { Component, Snippet } from 'svelte'
import type { SvelteFormApi } from '../formApiTypes.public'
import type { AnySvelteFormComponentMap } from './componentMap.public'
import type { ScopedErrorTypes } from '@tanstack/form-core'

export type AppFormComponent = Component<{ children: Snippet }>

export type SvelteAppFormApi<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TComponents extends AnySvelteFormComponentMap,
> = SvelteFormApi<TFormData, TFormError, TComponents> & {
  AppForm: AppFormComponent
}
