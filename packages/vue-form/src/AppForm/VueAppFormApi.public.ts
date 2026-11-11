import type { ScopedErrorTypes } from '@tanstack/form-core'
import type { PublicProps } from 'vue'
import type { VueComponentInstance } from '../vueTypes.lib'
import type { VueFormApi } from '../VueForm/formApiTypes.public'
import type { AnyVueFormComponentMap } from './componentMap.public'

export type AppFormComponent = new (
  props: PublicProps,
) => VueComponentInstance<{}, { default: {} }>

export type VueAppFormApi<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TComponents extends AnyVueFormComponentMap,
> = VueFormApi<TFormData, TFormError, TComponents> & {
  AppForm: AppFormComponent
}
