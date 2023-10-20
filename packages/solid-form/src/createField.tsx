import { FieldApi } from '@tanstack/form-core'
import {
  createComponent,
  createComputed,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { formContext, useFormContext } from './formContext'

import type { DeepKeys, DeepValue, Narrow } from '@tanstack/form-core'
import type { JSXElement } from 'solid-js'
import type { CreateFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<
    TParentData,
    TName extends DeepKeys<TParentData>,
    ValidatorType,
    FormValidator,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  > {
    Field: FieldComponent<TData, FormValidator>
  }
}

export type CreateField<TParentData> = <
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
>(
  opts: () => { name: Narrow<TName> } & CreateFieldOptions<
    TParentData,
    TName,
    ValidatorType,
    FormValidator
  >,
) => () => FieldApi<
  TParentData,
  TName,
  ValidatorType,
  FormValidator,
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
  ValidatorType,
  FormValidator,
>(
  opts: () => CreateFieldOptions<
    TParentData,
    TName,
    ValidatorType,
    FormValidator
  >,
): () => FieldApi<
  TParentData,
  TName,
  ValidatorType,
  FormValidator
  // Omit<typeof opts, 'onMount'> & {
  //   form: FormApi<TParentData>
  // }
> {
  // Get the form API either manually or from context
  const { formApi, parentFieldName } = useFormContext()

  const options = opts()
  const name = (
    typeof options.index === 'number'
      ? [parentFieldName, options.index, options.name]
      : [parentFieldName, options.name]
  )
    .filter((d) => d !== undefined)
    .join('.')

  const fieldApi = new FieldApi({
    ...options,
    form: formApi,
    name: name as typeof options.name,
  })
  fieldApi.Field = Field as never

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   *
   * createComputed to make sure this effect runs before render effects
   */
  createComputed(() => fieldApi.update({ ...opts(), form: formApi }))

  // Instantiates field meta and removes it when unrendered
  onMount(() => onCleanup(fieldApi.mount()))

  return makeFieldReactive(fieldApi)
}

type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = {
  children: (
    fieldApi: () => FieldApi<
      TParentData,
      TName,
      ValidatorType,
      FormValidator,
      TData
    >,
  ) => JSXElement
} & (TParentData extends any[]
  ? {
      name?: TName
      index: number
    }
  : {
      name: TName
      index?: never
    }) &
  Omit<
    CreateFieldOptions<TParentData, TName, ValidatorType, FormValidator>,
    'name' | 'index'
  >

export type FieldComponent<TParentData, FormValidator> = <
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<
  TParentData,
  TName,
  ValidatorType,
  FormValidator,
  TData
>) => JSXElement

export function Field<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
>(
  props: {
    children: (
      fieldApi: () => FieldApi<
        TParentData,
        TName,
        ValidatorType,
        FormValidator
      >,
    ) => JSXElement
  } & CreateFieldOptions<TParentData, TName, ValidatorType, FormValidator>,
) {
  const fieldApi = createField<
    TParentData,
    TName,
    ValidatorType,
    FormValidator
  >(() => {
    const { children, ...fieldOptions } = props
    return fieldOptions
  })

  return (
    <formContext.Provider
      value={{
        formApi: fieldApi().form,
        parentFieldName: String(fieldApi().name),
      }}
    >
      {/* createComponent to make sure the signals in the children component are not tracked */}
      {createComponent(() => props.children(fieldApi), {})}
    </formContext.Provider>
  )
}
