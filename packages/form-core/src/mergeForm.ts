import type { FormApi } from './FormApi'
import type { Validator } from './types'
import type { NoInfer } from './util-types'

/**
 * @private
 */
function mutateMergeDeep(target:any, source:any) {
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key) ||
        key === '__proto__' ||
        key === 'constructor' ||
        key === 'prototype') {
      continue;
    }
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) {
        target[key] = Array.isArray(source[key]) ? [] : {};
      }
      mutateMergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function isSafeProperty(key: string) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}

export function mergeForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  baseForm: FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>>,
  state: Partial<FormApi<TFormData, TFormValidator>['state']>,
) {
  mutateMergeDeep(baseForm.state, state)
  return baseForm
}
