import React, { useMemo, useRef } from 'react'
import type { FormOptions } from '@tanstack/form-core'
import type { UseFieldOptions } from '../types'
import type { Permutation, UnionToTuple } from './types'

/**
 * This allows us to not force our users to `useMemo` the arguments passed to
 * `useForm`, while also retaining a stable reference to the options object,
 * except items we expect the user to manually wrap with `useMemo` or
 * `useCallback`, such as `onSubmit` or similar.
 * @see https://github.com/TanStack/form/issues/437
 */
export function useStableOpts<
  /**
   * This complex jumbo of types forces us to pass **every** key from `Opts`,
   * without any overlap between `ToKeep` and `ToRemove`.
   */
  Opts extends object,
  OptArr extends UnionToTuple<keyof Opts>,
  ToKeep extends ReadonlyArray<OptArr[keyof OptArr]>,
  ToRemove extends UnionToTuple<
    Exclude<keyof Opts, ToKeep[number]>
  > extends infer U
    ? U extends readonly [never]
      ? readonly []
      : U extends readonly unknown[]
      ? Permutation<U[number]>
      : never
    : never,
>(
  newOptions: Opts,
  keyMeta: {
    stableKeys: ToKeep
    unstableKeys: ToRemove
  },
) {
  const keyMetaRef = useRef(keyMeta)
  const oldOptions = useRef(newOptions)

  const options = useMemo(() => {
    let rerender = false
    const changedKeys = {} as Partial<Opts>
    for (const optKey in newOptions) {
      const key: keyof typeof newOptions = optKey as never
      // Functions must be assigned to `options`
      if (keyMetaRef.current.stableKeys.includes(key as never)) continue
      changedKeys[key] = newOptions[key]
      rerender = true
    }
    // No change needed, return stable reference
    if (!rerender) return oldOptions.current
    return Object.assign({}, oldOptions.current, changedKeys)
  }, [newOptions])

  return options as Opts
}

export function useStableFormOpts<TData>(newOptions: FormOptions<TData> = {}) {
  return useStableOpts(newOptions, {
    stableKeys: [
      'defaultValues',
      'defaultState',
      'asyncDebounceMs',
      'onMountAsyncDebounceMs',
      'onChangeAsyncDebounceMs',
      'onBlurAsyncDebounceMs',
    ],
    unstableKeys: [
      'onMount',
      'onMountAsync',
      'onChange',
      'onChangeAsync',
      'onBlur',
      'onBlurAsync',
      'onSubmit',
      'onSubmitInvalid',
    ],
  } as const)
}

export function useStableFieldOpts<TData, TFormData>(
  newOptions: UseFieldOptions<TData, TFormData>,
) {
  return useStableOpts(newOptions, {
    stableKeys: [
      'mode',
      'name',
      'index',
      'defaultValue',
      'asyncDebounceMs',
      'asyncAlways',
      'onChangeAsyncDebounceMs',
      'onBlurAsyncDebounceMs',
      'defaultMeta',
    ],
    unstableKeys: [
      'onMount',
      'onChange',
      'onChangeAsync',
      'onBlur',
      'onBlurAsync',
      'onSubmitAsync',
    ],
  } as const)
}
