import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from './FormApi'

export function formOptions<
  T extends Partial<
    FormOptions<any, any, any, any, any, any, any, any, any, any>
  >,
>(defaultOpts: T) {
  return defaultOpts
}
