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

interface SolidFieldApi<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> {
  Field: FieldComponent<TParentData, TFormValidator>
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
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: () => { name: Narrow<TName> } & Omit<
    CreateFieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
    'form'
  >,
) => () => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData
> &
  SolidFieldApi<TParentData, TFormValidator>

// ugly way to trick solid into triggering updates for changes on the fieldApi
function makeFieldReactive<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  FieldApiT extends FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  > = FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> &
    SolidFieldApi<TParentData, TFormValidator>,
>(fieldApi: FieldApiT): () => FieldApiT {
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
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: () => CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
) {
  const options = opts()

  const api = new FieldApi(options)

  const extendedApi: typeof api & SolidFieldApi<TParentData, TFormValidator> =
    api as never

  extendedApi.Field = Field as never

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   *
   * createComputed to make sure this effect runs before render effects
   */
  createComputed(() => api.update(opts()))

  // Instantiates field meta and removes it when unrendered
  onMount(() => onCleanup(api.mount()))

  return makeFieldReactive(extendedApi as never)
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
  CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
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
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  props: {
    children: (
      fieldApi: () => FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
      >,
    ) => JSXElement
  } & CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
) {
  const fieldApi = createField<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >(() => {
    const { children, ...fieldOptions } = props
    return fieldOptions
  })

  return <>{createComponent(() => props.children(fieldApi), {})}</>
}
