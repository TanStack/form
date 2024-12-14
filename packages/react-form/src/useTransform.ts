import type {
  FormApi,
  FormTransform,
  StandardSchemaValidator,
  Validator,
} from '@tanstack/form-core'

export function useTransform<
  TFormData,
  TFormValidator extends Validator<
    TFormData,
    unknown
  > = StandardSchemaValidator,
>(
  fn: (formBase: FormApi<any, any>) => FormApi<TFormData, TFormValidator>,
  deps: unknown[],
): FormTransform<TFormData, TFormValidator> {
  return {
    fn,
    deps,
  }
}
