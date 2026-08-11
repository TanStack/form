import type {
  AnyFormApi,
  FormApi,
  FormErrorTypes,
  FormState,
} from '@tanstack/form-core'
import type { Component } from 'svelte'
import type { SvelteTanStackFormComponents } from './Components.public'
import type {
  AnySvelteFormComponentMap,
  DefaultSvelteFormComponentMap,
} from './AppForm/componentMap.public'

export interface SvelteFormSelectors<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> {
  useSelector: <TSelected = FormState<TFormData, TFormErrorTypes>>(
    selector?: (state: FormState<TFormData, TFormErrorTypes>) => TSelected,
  ) => { readonly current: TSelected }
}

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = FormApi<TFormData, TFormErrorTypes> &
  SvelteTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents> &
  SvelteFormSelectors<TFormData, TFormErrorTypes>

export type SvelteFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnySvelteFormComponentMap = DefaultSvelteFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

/**
 * A Svelte form API whose form data and error types are erased.
 *
 * Use it for reusable Svelte components that only need core form operations,
 * selectors, and the `Field`, `ArrayField`, `Subscribe`, or `FormGroup`
 * components common to every Svelte form. Field paths and values are not
 * checked against a particular form shape; use `SvelteFormType` when a
 * component depends on one known form.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const { form }: { form: AnySvelteFormApi } = $props()
 * </script>
 *
 * <form.Subscribe selector={(state) => state.isSubmitting}>
 *   {#snippet children(isSubmitting)}
 *     <button type="submit" disabled={isSubmitting}>
 *       {isSubmitting ? 'Saving...' : 'Save'}
 *     </button>
 *   {/snippet}
 * </form.Subscribe>
 * ```
 */
export type AnySvelteFormApi = AnyFormApi &
  SvelteTanStackFormComponents<any, any, any> &
  SvelteFormSelectors<any, any>

export type { SvelteFormComponentMap } from './AppForm/componentMap.public'
