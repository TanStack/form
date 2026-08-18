import type { Accessor, Component } from 'solid-js'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  AnySolidFormComponentMap,
  SolidFormComponentMap,
} from './componentMap.public'
import type { SolidAppFormApi } from './SolidAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
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
 * ```tsx
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
> extends SolidFormComponentMap<TFormComponents, TFieldComponents> {
  /**
   * Defaults for every form created by `useAppForm`.
   *
   * Non-listener options returned by the `useAppForm` options accessor
   * override these defaults, including when explicitly set to `undefined`.
   * Listener arrays follow `listenersMerge`.
   *
   * @example
   * ```tsx
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
   * ```tsx
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
   * ```tsx
   * defaultFormGroupOptions: {
   *   onSubmitInvalid: ({ groupApi }) => {
   *     console.error('Invalid group', groupApi.name)
   *   },
   * },
   * ```
   */
  defaultFormGroupOptions?: DefaultFormGroupOptions
}

export type UseAppFormHook<TComponents extends AnySolidFormComponentMap> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: Accessor<FormOptions<TFormData, TFormValidators, TSubmitReturn>>,
) => SolidAppFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

export interface AppFormHookResult<
  TComponents extends AnySolidFormComponentMap,
> {
  appFormOptions: AppFormOptionsApi<TComponents>
  defineAppFieldGroup: DefineFieldGroupFn<TComponents['fieldComponents']>
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => SolidAppFormApi<any, any, TComponents>
}
