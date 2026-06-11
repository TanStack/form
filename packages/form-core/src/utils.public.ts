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

type EditableObject<in out T extends object> = {
  [K in keyof T]: Editable<T[K]>
}

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

type InferUnionObject<
  in out TBase extends object,
  in out TIncoming extends object,
> = {
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

  strictSchema: <
    const TFormValidators extends FormValidators<any>,
    // Not quite sure why, but using FormValidatorData directly in the generic breaks things.
    // Probably something recursive going on that resolves it to `never`?
    TFormData extends FormValidatorData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => FormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn
  >

  looseSchema: <
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

formOptions.strictSchema = (opts) => opts
formOptions.looseSchema = (opts) => opts as never

export { formOptions }
