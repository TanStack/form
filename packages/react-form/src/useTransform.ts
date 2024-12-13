import type {
  FormApi,
  FormTransform,
  StandardSchemaV1,
  Validator,
} from '@tanstack/form-core'

export function useTransform<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> = Validator<
    TFormData,
    StandardSchemaV1<TFormData>
  >,
>(
  fn: (formBase: FormApi<any, any>) => FormApi<TFormData, TFormValidator>,
  deps: unknown[],
): FormTransform<TFormData, TFormValidator> {
  return {
    fn,
    deps,
  }
}
