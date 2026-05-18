import type { FormOptions } from './FormApi.public'
import type { BuiltInType } from './utils.lib'
import type { FormValidators } from './validation.public'

type Editable<T> = T extends BuiltInType
  ? T | null | undefined
  : T extends ReadonlyArray<unknown>
    ? Array<Editable<T[number]>>
    : T extends object
      ? EditableObject<T>
      : T | null | undefined

type EditableObject<T extends object> = { [K in keyof T]: Editable<T[K]> }

type InferUnion<TBase, TIncoming> = TBase extends BuiltInType
  ? TBase | TIncoming
  : TIncoming extends BuiltInType
    ? TBase | TIncoming
    : TBase extends ReadonlyArray<unknown>
      ? TIncoming extends ReadonlyArray<unknown>
        ? Array<InferUnion<TBase[number], TIncoming[number]>>
        : TBase | TIncoming
      : TBase extends object
        ? TIncoming extends object
          ? InferUnionObject<TBase, TIncoming>
          : TBase | TIncoming
        : TBase | TIncoming

type InferUnionObject<TBase extends object, TIncoming extends object> = {
  [K in keyof TBase | keyof TIncoming]: K extends keyof TBase
    ? K extends keyof TIncoming
      ? InferUnion<TBase[K], TIncoming[K]>
      : TBase[K]
    : K extends keyof TIncoming
      ? TIncoming[K] | undefined
      : never
}

type FormValidatorData<TFormValidators extends FormValidators<any>> =
  TFormValidators extends FormValidators<infer T> ? T : never

type NullableSchemaData<TFormValidators extends FormValidators<any>> = Editable<
  FormValidatorData<TFormValidators>
>

export interface FormOptionsApi {
  <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ): FormOptions<TFormData, TFormValidators, TSubmitReturn>

  schemaBased: <
    const TFormValidators extends FormValidators<any>,
    TSubmitReturn,
  >(
    options: FormOptions<
      FormValidatorData<TFormValidators>,
      TFormValidators,
      TSubmitReturn
    >,
  ) => TFormValidators extends FormValidators<infer T>
    ? FormOptions<T, TFormValidators, TSubmitReturn>
    : never

  nullableSchema: <
    const TFormValidators extends FormValidators<any>,
    const TFormData extends NullableSchemaData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => FormOptions<
    InferUnion<TFormData, FormValidatorData<TFormValidators>>,
    TFormValidators,
    TSubmitReturn
  >
}

const formOptions = ((opts) => {
  return opts
}) as FormOptionsApi

formOptions.schemaBased = (opts) => opts as never
formOptions.nullableSchema = (opts) => opts as never

export { formOptions }
