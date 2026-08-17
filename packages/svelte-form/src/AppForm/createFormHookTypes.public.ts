import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  AnySvelteFormComponentMap,
  SvelteFormComponentMap,
} from './componentMap.public'
import type { SvelteAppFormApi } from './SvelteAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type { Component } from 'svelte'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

/**
 * Configures the components and reusable defaults returned by
 * `createFormHook`.
 *
 * Form core resolves each default object before the corresponding usage-site
 * options. Non-listener properties passed at the usage site take precedence,
 * including when explicitly set to `undefined`. Listener arrays follow the
 * configured `listenersMerge` strategy.
 *
 * @example
 * ```ts
 * const { useAppForm } = createFormHook({
 *   formComponents: {},
 *   fieldComponents: {
 *     TextField,
 *   },
 *   defaultFormOptions: {
 *     errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
 *   },
 *   defaultFieldOptions: {
 *     errorBoundary: true,
 *   },
 * })
 * ```
 *
 * @typeParam TFormComponents - Library-managed. Do not specify explicitly.
 * @typeParam TFieldComponents - Library-managed. Do not specify explicitly.
 */
export interface CreateFormHookOptions<
  TFormComponents extends Record<string, Component<any>>,
  TFieldComponents extends Record<string, Component<any>>,
> extends SvelteFormComponentMap<TFormComponents, TFieldComponents> {
  /**
   * Defaults for every form created by `useAppForm`.
   *
   * Non-listener options returned by the `useAppForm` options accessor
   * override these defaults, including when explicitly set to `undefined`.
   * Listener arrays follow `listenersMerge`.
   *
   * @example
   * ```ts
   * defaultFormOptions: {
   *   errorVisibility: ({ state }) => state.submissionAttempts > 0,
   * },
   * ```
   */
  defaultFormOptions?: DefaultFormOptions
  /**
   * Defaults for every field and array-field component owned by the form.
   *
   * Non-listener options passed to the component override these defaults,
   * including when explicitly set to `undefined`. Listener arrays follow
   * `listenersMerge`. This includes `group.Field` and `group.ArrayField`.
   *
   * @example
   * ```ts
   * defaultFieldOptions: {
   *   errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
   * },
   * ```
   */
  defaultFieldOptions?: DefaultFieldOptions
  /**
   * Defaults for every `form.FormGroup` component.
   *
   * Options passed to the component override these defaults, including when
   * an option is explicitly `undefined`.
   *
   * @example
   * ```ts
   * defaultFormGroupOptions: {
   *   onSubmitInvalid: ({ groupApi }) => {
   *     console.error('Invalid group', groupApi.name)
   *   },
   * },
   * ```
   */
  defaultFormGroupOptions?: DefaultFormGroupOptions
}

export type UseAppFormHook<TComponents extends AnySvelteFormComponentMap> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: () => FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => SvelteAppFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

export interface AppFormHookResult<
  TComponents extends AnySvelteFormComponentMap,
> {
  appFormOptions: AppFormOptionsApi<TComponents>
  defineAppFieldGroup: DefineFieldGroupFn<TComponents['fieldComponents']>
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => SvelteAppFormApi<any, any, TComponents>
}
