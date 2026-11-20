import type {
  AnyFormApi,
  FormApi,
  FormState,
  ScopedErrorTypes,
} from '@tanstack/form-core'
import type { Component } from 'svelte'
import type { SvelteTanStackFormComponents } from './Components.public'
import type {
  AnySvelteFormComponentMap,
  DefaultSvelteFormComponentMap,
} from './AppForm/componentMap.public'

export interface SvelteFormSelectors<
  TFormData,
  TFormError extends ScopedErrorTypes,
> {
  useSelector: <TSelected = FormState<TFormData, TFormError>>(
    selector?: (state: FormState<TFormData, TFormError>) => TSelected,
  ) => { readonly current: TSelected }
}

type ExtendedFormApi<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = FormApi<TFormData, TFormError> &
  SvelteTanStackFormComponents<TFormData, TFormError, TFieldComponents> &
  SvelteFormSelectors<TFormData, TFormError>

export type SvelteFormApi<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TComponents extends AnySvelteFormComponentMap = DefaultSvelteFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormError, TComponents['fieldComponents']>
  : ExtendedFormApi<TFormData, TFormError, TComponents['fieldComponents']> &
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
