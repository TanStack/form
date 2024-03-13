import { FieldApi } from '@tanstack/form-core'
import {
  createComponent,
  createComputed,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'

import type {
  DeepKeys,
  DeepValue,
  Narrow,
  Validator,
} from '@tanstack/form-core'
import type { JSXElement } from 'solid-js'
import type { CreateFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFieldValidator extends
      | Validator<DeepValue<TParentData, TName>, unknown>
      | undefined = undefined,
    TFormValidator extends
      | Validator<TParentData, unknown>
      | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  > {
    Field: FieldComponent<TParentData, TFormValidator>
  }
}

export type CreateField<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
>(
  opts: () => { name: Narrow<TName> } & Omit<
    CreateFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>,
    'form'
  >,
) => () => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  DeepValue<TParentData, TName>
>

// ugly way to trick solid into triggering updates for changes on the fieldApi
function makeFieldReactive<FieldApiT extends FieldApi<any, any, any, any>>(
  fieldApi: FieldApiT,
): () => FieldApiT {
  const [flag, setFlag] = createSignal(false)
  const fieldApiMemo = createMemo(() => [flag(), fieldApi] as const)
  const unsubscribeStore = fieldApi.store.subscribe(() => setFlag((f) => !f))
  onCleanup(unsubscribeStore)
  return () => fieldApiMemo()[1]
}

export function createField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>(
  opts: () => CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator
  >,
): () => FieldApi<TParentData, TName, TFieldValidator, TFormValidator> {
  const options = opts()

  const fieldApi = new FieldApi(options)
  fieldApi.Field = Field as never

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   *
   * createComputed to make sure this effect runs before render effects
   */
  createComputed(() => fieldApi.update(opts()))

  // Instantiates field meta and removes it when unrendered
  onMount(() => onCleanup(fieldApi.mount()))

  return makeFieldReactive(fieldApi) as never
}

type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = {
  children: (
    fieldApi: () => FieldApi<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
  ) => JSXElement
} & Omit<
  CreateFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>,
  'form'
>

export type FieldComponent<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  children,
  ...fieldOptions
}: Omit<
  FieldComponentProps<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
  'form'
>) => JSXElement

export function Field<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>(
  props: {
    children: (
      fieldApi: () => FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator
      >,
    ) => JSXElement
  } & CreateFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>,
) {
  const fieldApi = createField<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator
  >(() => {
    const { children, ...fieldOptions } = props
    return fieldOptions
  })

  return <>{createComponent(() => props.children(fieldApi), {})}</>
}
