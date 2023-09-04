import { FormOptions } from '@tanstack/form-core'
import { useMemo, useRef } from 'react'
import { UseFieldOptions } from './useField'

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

function useStableOpts<PropType extends object>(
  newOptions: Partial<PropType> = {},
) {
  const oldOptions = useRef(newOptions)

  const options = useMemo(() => {
    let rerender = false
    const changedKeys = {} as Partial<PropType>
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

export function useStableFormOpts<TData>(newOptions: FormOptions<TData> = {}) {
  return useStableOpts<typeof newOptions>(newOptions)
}

export function useStableFieldOpts<TData, TFormData>(
  newOptions: UseFieldOptions<TData, TFormData>,
) {
  return useStableOpts<typeof newOptions>(newOptions)
}
