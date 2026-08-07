import type { FormErrorTypes } from '@tanstack/form-core'
import type { PublicProps } from 'vue'
import type { VueComponentInstance } from '../vueTypes.lib'
import type { VueFormApi } from '../VueForm/formApiTypes.public'
import type { AnyVueFormComponentMap } from './componentMap.public'

export type AppFormComponent = new (
  props: PublicProps,
) => VueComponentInstance<{}, { default: {} }>

export type VueAppFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyVueFormComponentMap,
> = VueFormApi<TFormData, TFormErrorTypes, TComponents> & {
  AppForm: AppFormComponent
}
