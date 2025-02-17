import type { FormApi } from './FormApi'
import type { NoInfer } from './util-types'

/**
 * @private
 */
export function mutateMergeDeep(target: object, source: object): object {
  const targetKeys = Object.keys(target)
  const sourceKeys = Object.keys(source)
  const keySet = new Set([...targetKeys, ...sourceKeys])
  for (const key of keySet) {
    const targetKey = key as never as keyof typeof target
    const sourceKey = key as never as keyof typeof source

    if (Array.isArray(target[targetKey]) && Array.isArray(source[sourceKey])) {
      // always use the source array to prevent array fields from multiplying
      target[targetKey] = source[sourceKey] as [] as never
    } else if (
      typeof target[targetKey] === 'object' &&
      typeof source[sourceKey] === 'object'
    ) {
      mutateMergeDeep(target[targetKey] as {}, source[sourceKey] as {})
    } else {
      // Prevent assigning undefined to target, only if undefined is not explicitly set on source
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!(sourceKey in source) && source[sourceKey] === undefined) {
        continue
      }
      target[targetKey] = source[sourceKey] as never
    }
  }
  return target
}

export function mergeForm<TFormData>(
  baseForm: FormApi<NoInfer<TFormData>, any, any, any, any, any, any, any, any>,
  state: Partial<
    FormApi<TFormData, any, any, any, any, any, any, any, any>['state']
  >,
) {
  mutateMergeDeep(baseForm.state, state)
  return baseForm
}
