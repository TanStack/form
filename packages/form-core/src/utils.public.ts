import type { FormOptions } from './FormApi/FormApi.public'
import type { FormValidators } from './validation.public'

type Primitive = string | number | boolean | bigint | symbol | null | undefined

export type BuiltInType =
  | Primitive
  | Date
  | RegExp
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function

export type Editable<T> = T extends BuiltInType
  ? T | null | undefined
  : T extends ReadonlyArray<unknown>
    ? Array<Editable<T[number]>> | null | undefined
    : T extends object
      ? EditableObject<T> | null | undefined
      : T | null | undefined

type EditableObject<T extends object> = { [K in keyof T]: Editable<T[K]> }

export type InferUnion<TBase, TIncoming> = TBase extends BuiltInType
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

export type FormValidatorData<TFormValidators extends FormValidators<any>> =
  TFormValidators extends FormValidators<infer T> ? T : never

export type NullableSchemaData<TFormValidators extends FormValidators<any>> =
  Editable<FormValidatorData<TFormValidators>>

export interface FormOptionsApi {
  <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ): FormOptions<TFormData, TFormValidators, TSubmitReturn>

  schema: <
    const TFormValidators extends FormValidators<any>,
    TFormData extends FormValidatorData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => FormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn
  >

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

formOptions.schema = (opts) => opts
formOptions.nullableSchema = (opts) => opts as never

export { formOptions }
