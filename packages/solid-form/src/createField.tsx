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
  TParentMetaExtension = never,
> {
  Field: FieldComponent<TParentData, TFormValidator, TParentMetaExtension>
}

export type CreateField<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TParentMetaExtension = never,
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
      TData,
      TParentMetaExtension
    >,
    'form'
  >,
) => () => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData,
  TParentMetaExtension
> &
  SolidFieldApi<TParentData, TFormValidator, TParentMetaExtension>

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
  TParentMetaExtension = never,
  FieldApiT extends FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  > = FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  > &
    SolidFieldApi<TParentData, TFormValidator, TParentMetaExtension>,
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
  TParentMetaExtension = never,
>(
  opts: () => CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >,
) {
  const options = opts()

  const api = new FieldApi(options)

  const extendedApi: typeof api &
    SolidFieldApi<TParentData, TFormValidator, TParentMetaExtension> =
    api as never

  extendedApi.Field = Field as never

  let mounted = false
  // Instantiates field meta and removes it when unrendered
  onMount(() => {
    const cleanupFn = api.mount()
    mounted = true
    onCleanup(() => {
      cleanupFn()
      mounted = false
    })
  })

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   *
   * createComputed to make sure this effect runs before render effects
   */
  createComputed(() => {
    if (!mounted) return
    api.update(opts())
  })

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
  TParentMetaExtension = never,
> = {
  children: (
    fieldApi: () => FieldApi<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >,
  ) => JSXElement
} & Omit<
  CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >,
  'form'
>

export type FieldComponent<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TParentMetaExtension = never,
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
    TData,
    TParentMetaExtension
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
  TParentMetaExtension = never,
>(
  props: {
    children: (
      fieldApi: () => FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData,
        TParentMetaExtension
      >,
    ) => JSXElement
  } & CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >,
) {
  const fieldApi = createField<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >(() => {
    const { children, ...fieldOptions } = props
    return fieldOptions
  })

  return <>{createComponent(() => props.children(fieldApi), {})}</>
}
