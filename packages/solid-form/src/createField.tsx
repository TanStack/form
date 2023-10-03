import { FieldApi } from '@tanstack/form-core'
import {
  createComponent,
  createComputed,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { formContext, useFormContext } from './formContext'

import type { DeepKeys, DeepValue } from '@tanstack/form-core'
import type { JSXElement } from 'solid-js'
import type { CreateFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TData = DeepValue<TParentData, TName>,
  > {
    Field: FieldComponent<TParentData>
  }
}

export type CreateField<TParentData> = typeof createField<TParentData>

// ugly way to trick solid into triggering updates for changes on the fieldApi
function makeFieldReactive<FieldApiT extends FieldApi<any, any>>(
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
  TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
>(
  opts: () => CreateFieldOptions<TParentData, TName>,
): () => FieldApi<
  TParentData,
  TName
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

  const fieldApi = new FieldApi<TParentData, TName>({
    ...options,
    form: formApi,
    name: name,
  } as never)
  fieldApi.Field = Field as never

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  createComputed(() => fieldApi.update({ ...opts(), form: formApi }))

  // Instantiates field meta and removes it when unrendered
  onMount(() => onCleanup(fieldApi.mount()))

  return makeFieldReactive(fieldApi)
}

type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
> = {
  children: (fieldApi: () => FieldApi<TParentData, TName, TData>) => JSXElement
} & (TParentData extends any[]
  ? {
      name?: TName
      index: number
    }
  : {
      name: TName
      index?: never
    }) &
  Omit<CreateFieldOptions<TParentData, TName>, 'name' | 'index'>

export type FieldComponent<TParentData> = <
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<TParentData, TName, TData>) => any

export function Field<
  TParentData,
  TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
>(
  props: {
    children: (fieldApi: () => FieldApi<TParentData, TName>) => JSXElement
  } & CreateFieldOptions<TParentData, TName>,
) {
  const fieldApi = createField<TParentData, TName>(() => {
    const { children, ...fieldOptions } = props
    return fieldOptions as any
  })

  return (
    <formContext.Provider
      value={{
        formApi: fieldApi().form,
        parentFieldName: String(fieldApi().name),
      }}
    >
      {createComponent(() => props.children(fieldApi), {})}
    </formContext.Provider>
  )
}
