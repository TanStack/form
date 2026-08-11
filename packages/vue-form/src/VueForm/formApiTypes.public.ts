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

/**
 * A Vue form API whose form data and error types are erased.
 *
 * Use it for reusable Vue components that only need core form operations and
 * the `Field`, `ArrayField`, `Subscribe`, or `FormGroup` components common to
 * every Vue form. Field paths and values are not checked against a particular
 * form shape; use `VueFormType` when a component depends on one known form.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * defineProps<{ form: AnyVueFormApi }>()
 * </script>
 *
 * <template>
 *   <form.Subscribe
 *     :selector="(state) => state.isSubmitting"
 *     v-slot="isSubmitting"
 *   >
 *     <button type="submit" :disabled="isSubmitting">
 *       {{ isSubmitting ? 'Saving...' : 'Save' }}
 *     </button>
 *   </form.Subscribe>
 * </template>
 * ```
 */
export type AnyVueFormApi = AnyFormApi &
  VueTanStackFormComponents<any, any, any>

export type { VueFormComponentMap } from '../AppForm/componentMap.public'
