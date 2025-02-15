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
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> {
  Field: FieldComponent<
    TParentData,
    TFormValidator,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >
}

export type CreateField<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
>(
  opts: () => { name: Narrow<TName> } & Omit<
    CreateFieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
    >,
    'form'
  >,
) => () => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData,
  TOnMountReturn,
  TOnChangeReturn,
  TOnChangeAsyncReturn,
  TOnBlurReturn,
  TOnBlurAsyncReturn,
  TOnSubmitReturn,
  TOnSubmitAsyncReturn,
  TFormOnMountReturn,
  TFormOnChangeReturn,
  TFormOnChangeAsyncReturn,
  TFormOnBlurReturn,
  TFormOnBlurAsyncReturn,
  TFormOnSubmitReturn,
  TFormOnSubmitAsyncReturn,
  TFormOnServerReturn
> &
  SolidFieldApi<
    TParentData,
    TFormValidator,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >

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
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
>(
  fieldApi: FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  > &
    SolidFieldApi<
      TParentData,
      TFormValidator,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
    >,
): () => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData,
  TOnMountReturn,
  TOnChangeReturn,
  TOnChangeAsyncReturn,
  TOnBlurReturn,
  TOnBlurAsyncReturn,
  TOnSubmitReturn,
  TOnSubmitAsyncReturn,
  TFormOnMountReturn,
  TFormOnChangeReturn,
  TFormOnChangeAsyncReturn,
  TFormOnBlurReturn,
  TFormOnBlurAsyncReturn,
  TFormOnSubmitReturn,
  TFormOnSubmitAsyncReturn,
  TFormOnServerReturn
> &
  SolidFieldApi<
    TParentData,
    TFormValidator,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  > {
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
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
>(
  opts: () => CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >,
) {
  const options = opts()

  const api = new FieldApi(options)

  const extendedApi: typeof api &
    SolidFieldApi<
      TParentData,
      TFormValidator,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
    > = api as never

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

  return makeFieldReactive<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >(extendedApi as never)
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
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> = {
  children: (
    fieldApi: () => FieldApi<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
    >,
  ) => JSXElement
} & Omit<
  CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >,
  'form'
>

export type FieldComponent<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
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
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
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
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
>(
  props: {
    children: (
      fieldApi: () => FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData,
        TOnMountReturn,
        TOnChangeReturn,
        TOnChangeAsyncReturn,
        TOnBlurReturn,
        TOnBlurAsyncReturn,
        TOnSubmitReturn,
        TOnSubmitAsyncReturn,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      >,
    ) => JSXElement
  } & CreateFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >,
) {
  const fieldApi = createField<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >(() => {
    const { children, ...fieldOptions } = props
    return fieldOptions
  })

  return <>{createComponent(() => props.children(fieldApi), {})}</>
}
