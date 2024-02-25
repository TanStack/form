import React, { useRef, useState } from 'rehackt'
import { useStore } from '@tanstack/react-store'
import { FieldApi, functionalUpdate } from '@tanstack/form-core'
import { formContext, useFormContext } from './formContext'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { useIsomorphicEffectOnce } from './useIsomorphicEffectOnce'
import type { UseFieldOptions } from './types'
import type {
  DeepKeys,
  DeepValue,
  Narrow,
  Validator,
} from '@tanstack/form-core'

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

export type UseField<TParentData> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>(
  opts?: { name: Narrow<TName> } & UseFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator
  >,
) => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  DeepValue<TParentData, TName>
>

export function useField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>(
  opts: UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>,
): FieldApi<TParentData, TName, TFieldValidator, TFormValidator> {
  // Get the form API either manually or from context
  const { formApi, parentFieldName } = useFormContext()

  const unmountFn = useRef<(() => void) | null>(null)

  const [fieldApi] = useState(() => {
    const name = (
      typeof opts.index === 'number'
        ? [parentFieldName, opts.index, opts.name]
        : [parentFieldName, opts.name]
    )
      .filter((d) => d !== undefined)
      .join('.')

    const previousInstance = formApi.getFieldInfo(name).instance as never as
      | FieldApi<
          TParentData,
          TName,
          TFieldValidator,
          TFormValidator,
          DeepValue<TParentData, TName>
        >
      | undefined

    /*
     * <StrictMode> executes functional useStates twice, so we need to return the previous instance
     * @see https://react.dev/reference/react/useState#my-initializer-or-updater-function-runs-twice
     */
    if (previousInstance) {
      // `mount` will return the previous unmount function if the instance is already mounted
      unmountFn.current = previousInstance.mount()
      return previousInstance
    }

    const api = new FieldApi({
      ...opts,
      form: formApi as never,
      // TODO: Fix typings to include `index` and `parentFieldName`, if present
      name: name as typeof opts.name as never,
    })

    api.Field = Field as never

    unmountFn.current = api.mount()

    return api
  })

  useIsomorphicEffectOnce(() => {
    return () => {
      unmountFn.current?.()
    }
  })

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  useIsomorphicLayoutEffect(() => {
    fieldApi.update({ ...opts, form: formApi } as never)
  })

  useStore(
    fieldApi.store,
    opts.mode === 'array'
      ? (state) => {
          return [state.meta, Object.keys(state.value).length]
        }
      : undefined,
  )

  return fieldApi as never
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
    fieldApi: FieldApi<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
  ) => any
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
    UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>,
    'name' | 'index'
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
}: FieldComponentProps<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData
>) => any

export function Field<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>({
  children,
  ...fieldOptions
}: {
  children: (
    fieldApi: FieldApi<TParentData, TName, TFieldValidator, TFormValidator>,
  ) => any
} & UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>) {
  const fieldApi = useField(fieldOptions as any)

  return (
    <formContext.Provider
      value={{
        formApi: fieldApi.form as never,
        parentFieldName: fieldApi.name,
      }}
      children={functionalUpdate(children, fieldApi as any)}
    />
  )
}
