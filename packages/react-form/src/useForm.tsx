import type { FormState, FormOptions } from '@tanstack/form-core'
import { FormApi, functionalUpdate } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/react-store'
import { useStore } from '@tanstack/react-store'
import React, { useCallback, useMemo, useRef } from 'react'
import { type UseField, type FieldComponent, Field, useField } from './useField'
import { formContext } from './formContext'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Provider: (props: { children: any }) => any
    Field: FieldComponent<TFormData, TFormData>
    useField: UseField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children:
        | ((state: NoInfer<TSelected>) => React.ReactNode)
        | React.ReactNode
    }) => any
  }
}

/**
 * This allows us to not force our users to `useMemo` the arguments passed to
 * `useForm`, while also retaining a stable reference to the options object,
 * except items we expect the user to manually wrap with `useMemo` or
 * `useCallback`, such as `onSubmit` or similar.
 * @see https://github.com/TanStack/form/issues/437
 */
// We expect these keys to always be stable, so we never listen for changes to them
const stableKeyTypes = [
  'string',
  'number',
  'bigint',
  'boolean',
  'symbol',
  'undefined',
  'object',
] as Array<
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function'
>

function useStableFormOpts<TData>(newOptions: FormOptions<TData> = {}) {
  const oldOptions = useRef(newOptions)

  const options = useMemo(() => {
    let rerender = false
    const changedKeys = {} as Partial<FormOptions<TData>>
    for (let optKey in newOptions) {
      const key: keyof typeof newOptions = optKey as never
      // Functions must be assigned to `options`
      if (stableKeyTypes.includes(typeof newOptions[key])) continue
      if (
        typeof newOptions[key] === 'function' &&
        oldOptions.current[key] !== newOptions[key]
      ) {
        changedKeys[key] = newOptions[key]
        rerender = true
      }
    }
    // No change needed, return stable reference
    if (!rerender) return oldOptions.current
    return Object.assign({}, oldOptions.current, changedKeys)
  }, [newOptions])

  return options
}

export function useForm<TData>(opts?: FormOptions<TData>): FormApi<TData> {
  const [formApi] = React.useState(() => {
    // @ts-ignore
    const api = new FormApi<TData>(opts)

    // eslint-disable-next-line react/display-name
    api.Provider = (props) => (
      <formContext.Provider {...props} value={{ formApi: api }} />
    )
    api.Field = Field as any
    api.useField = useField as any
    api.useStore = (
      // @ts-ignore
      selector,
    ) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useStore(api.store as any, selector as any) as any
    }
    api.Subscribe = (
      // @ts-ignore
      props,
    ) => {
      return functionalUpdate(
        props.children,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useStore(api.store as any, props.selector as any),
      ) as any
    }

    return api
  })

  formApi.useStore((state) => state.isSubmitting)

  const options = useStableFormOpts(opts)

  React.useEffect(() => {
    formApi.update(options)
  }, [formApi, options])

  return formApi as any
}

/**
 * This is a hack to get around the fact that the type of useCallback does not
 * allow for the props type to be inferred. This is a known issue:
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52873#issuecomment-845806435
 */
export const useFormCallback = useCallback as never as <
  Props extends Array<any>,
  Return,
>(
  fn: (...props: Props) => Return,
  deps: Array<any>,
) => typeof fn
