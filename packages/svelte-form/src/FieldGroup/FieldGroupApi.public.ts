import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldValidators,
  FormApiArrayMethods,
  FormApiFieldMethods,
  FormErrorTypes,
  FormState,
  ValidationIssue,
} from '@tanstack/form-core'
import type {
  Component,
  ComponentConstructorOptions,
  SvelteComponent,
} from 'svelte'
import type {
  SvelteFormFieldProps,
  SvelteFormSubscribeProps,
  WithoutFunction,
} from '../Components.public'
import type { ReadonlyAtom } from '@tanstack/svelte-store'

export type FieldGroupFieldComponent<
  TFieldData,
  TFieldComponents extends Record<string, Component<any>>,
> = (new <const TFieldName extends DeepKeys<TFieldData>>(
  options: ComponentConstructorOptions<
    SvelteFormFieldProps<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>,
      FieldValidators<
        TFieldData,
        TFieldName,
        DeepValue<TFieldData, TFieldName>
      >,
      ValidationIssue,
      unknown,
      FormErrorTypes,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type FieldGroupArrayFieldComponent<
  TFieldData,
  TFieldComponents extends Record<string, Component<any>>,
> = (new <
  const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>,
>(
  options: ComponentConstructorOptions<
    SvelteFormFieldProps<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>,
      FieldValidators<
        TFieldData,
        TFieldName,
        DeepValue<TFieldData, TFieldName>
      >,
      ValidationIssue,
      unknown,
      FormErrorTypes,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type FieldGroupSubscribeComponent = (new <TSelected>(
  options: ComponentConstructorOptions<
    SvelteFormSubscribeProps<unknown, FormErrorTypes, TSelected>
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export interface FieldGroupApi<
  TFieldData,
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
>
  extends FormApiFieldMethods<TFieldData>, FormApiArrayMethods<TFieldData> {
  atom: ReadonlyAtom<TFieldData>
  Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>
  ArrayField: FieldGroupArrayFieldComponent<TFieldData, TFieldComponents>
  Subscribe: FieldGroupSubscribeComponent
}

export type AnyFieldGroupApi = FieldGroupApi<
  any,
  Record<string, Component<any>>
>
export type FieldGroupFormState = FormState<unknown, FormErrorTypes>
