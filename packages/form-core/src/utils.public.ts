import type { FormOptions } from './FormApi/FormApi.public'
import type { FormValidators } from './validation.public'

type Primitive = string | number | boolean | bigint | symbol | null | undefined

export type BuiltInType = Primitive | Date | RegExp | Function

export type Editable<T> = T extends BuiltInType
  ? T | null | undefined
  : T extends ReadonlyArray<unknown>
    ? Array<Editable<T[number]>> | null | undefined
    : T extends object
      ? EditableObject<T> | null | undefined
      : T | null | undefined

type EditableObject<in out T extends object> = {
  [K in keyof T]?: Editable<T[K]>
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

/**
 * Infers the form data type from a Standard Schema validator and requires
 * `defaultValues` to match the schema input.
 *
 * Use this when the schema represents an input-to-output pipeline. Raw form
 * state remains available as `value`; read each validator's parsed output
 * from the corresponding `schemaOutputs` entry during submission.
 *
 * At runtime, this returns the original options object and does not run the
 * schema.
 *
 * Include the schema in `validators` to provide the type inference and
 * perform validation.
 *
 * @remarks
 * **Important:** Although this returns the original object unchanged at
 * runtime, its type is normalized to `FormOptions`. Optional properties such
 * as `validators` therefore remain optional even when supplied. This
 * tradeoff enables safer inference and reuse.
 *
 * @example
 * ```ts
 * const profileOptions = formOptions.strictSchema({
 *   defaultValues: { name: '' },
 *   validators: [
 *     {
 *       triggers: ['change'],
 *       run: z.object({ name: z.string().min(1) }),
 *     },
 *   ],
 *   onSubmit: ({ schemaOutputs }) => saveProfile(schemaOutputs[0]),
 * })
 * ```
 *
 * @returns The original options object, normalized to `FormOptions` with the
 * schema's input shape.
 * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
 * @typeParam TComponents - Library-managed. Do not specify explicitly.
 */
export type FormOptionsStrictSchemaFn<TComponents> = <
  const TFormValidators extends FormValidators<any>,
  // Not quite sure why, but using FormValidatorData directly in the generic breaks things.
  // Probably something recursive going on that resolves it to `never`?
  TFormData extends FormValidatorData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown>,
) => FormOptions<
  FormValidatorData<TFormValidators>,
  TFormValidators,
  TSubmitReturn,
  TComponents
>

/**
 * Infers the form data shape from a Standard Schema validator while allowing
 * editable defaults to omit properties or contain `null` or `undefined`
 * values.
 *
 * Use this when the schema represents the final valid shape but the UI needs
 * intermediate empty states, such as an unselected date. Raw form state
 * remains available as `value`; read each validator's parsed output from the
 * corresponding `schemaOutputs` entry during submission.
 *
 * At runtime, this returns the original options object and does not run the
 * schema.
 *
 * Include the schema in `validators` to provide the type inference and
 * perform validation.
 *
 * @remarks
 * **Important:** Although this returns the original object unchanged at
 * runtime, its type is normalized to `FormOptions`. Optional properties such
 * as `validators` therefore remain optional even when supplied. This
 * tradeoff enables safer inference and reuse.
 *
 * @example
 * ```ts
 * const bookingOptions = formOptions.looseSchema({
 *   defaultValues: { startDate: null },
 *   validators: [
 *     {
 *       triggers: ['blur'],
 *       run: z.object({ startDate: z.date() }),
 *     },
 *   ],
 *   onSubmit: ({ schemaOutputs }) => saveBooking(schemaOutputs[0]),
 * })
 * ```
 *
 * @returns The original options object, normalized to `FormOptions` with
 * omitted, nullable, and undefined editable states merged into the schema's
 * input shape.
 * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
 * @typeParam TComponents - Library-managed. Do not specify explicitly.
 *
 */
export type FormOptionsLooseSchemaFn<TComponents> = <
  const TFormValidators extends FormValidators<any>,
  const TFormData extends NullableSchemaData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown>,
) => FormOptions<
  InferUnion<TFormData, FormValidatorData<TFormValidators>>,
  TFormValidators,
  TSubmitReturn,
  TComponents
>

/**
 * The callable API exposed by `formOptions`, including its schema-driven
 * inference modes.
 *
 * Use `formOptions` directly instead of naming this interface in application
 * code.
 *
 * @typeParam TComponents - Library-managed. Do not specify explicitly.
 */
export interface FormOptionsApi<out TComponents> {
  /**
   * Keeps types inferred from `defaultValues`, validators, and submission
   * callbacks when form options are declared separately.
   *
   * `defaultValues` determine the form data shape in this mode. At runtime,
   * this returns the original options object and does not create a form or run
   * validation.
   *
   * @remarks
   * **Important:** Although this returns the original object unchanged at
   * runtime, its type is normalized to `FormOptions`. Optional properties such
   * as `validators` therefore remain optional even when supplied. This
   * tradeoff enables safer inference and reuse.
   *
   * @returns The original options object, normalized to `FormOptions` with its
   * inferred form data, validator, and submission types.
   * @typeParam TFormData - Library-managed. Do not specify explicitly.
   * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
   * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
   */
  <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown>,
  ): FormOptions<TFormData, TFormValidators, TSubmitReturn, TComponents>

  /**
   * Infers the form data type from a Standard Schema validator and requires
   * `defaultValues` to match the schema input.
   *
   * Use this when the schema represents an input-to-output pipeline. Raw form
   * state remains available as `value`; read each validator's parsed output
   * from the corresponding `schemaOutputs` entry during submission.
   *
   * At runtime, this returns the original options object and does not run the
   * schema.
   *
   * Include the schema in `validators` to provide the type inference and
   * perform validation.
   *
   * @remarks
   * **Important:** Although this returns the original object unchanged at
   * runtime, its type is normalized to `FormOptions`. Optional properties such
   * as `validators` therefore remain optional even when supplied. This
   * tradeoff enables safer inference and reuse.
   *
   * @example
   * ```ts
   * const profileOptions = formOptions.strictSchema({
   *   defaultValues: { name: '' },
   *   validators: [
   *     {
   *       triggers: ['change'],
   *       run: z.object({ name: z.string().min(1) }),
   *     },
   *   ],
   *   onSubmit: ({ schemaOutputs }) => saveProfile(schemaOutputs[0]),
   * })
   * ```
   *
   * @returns The original options object, normalized to `FormOptions` with the
   * schema's input shape.
   * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
   * @typeParam TFormData - Library-managed. Do not specify explicitly.
   * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
   */
  strictSchema: FormOptionsStrictSchemaFn<TComponents>

  /**
   * Infers the form data shape from a Standard Schema validator while allowing
   * editable defaults to omit properties or contain `null` or `undefined`
   * values.
   *
   * Use this when the schema represents the final valid shape but the UI needs
   * intermediate empty states, such as an unselected date. Raw form state
   * remains available as `value`; read each validator's parsed output from the
   * corresponding `schemaOutputs` entry during submission.
   *
   * At runtime, this returns the original options object and does not run the
   * schema.
   *
   * Include the schema in `validators` to provide the type inference and
   * perform validation.
   *
   * @remarks
   * **Important:** Although this returns the original object unchanged at
   * runtime, its type is normalized to `FormOptions`. Optional properties such
   * as `validators` therefore remain optional even when supplied. This
   * tradeoff enables safer inference and reuse.
   *
   * @example
   * ```ts
   * const bookingOptions = formOptions.looseSchema({
   *   defaultValues: { startDate: null },
   *   validators: [
   *     {
   *       triggers: ['blur'],
   *       run: z.object({ startDate: z.date() }),
   *     },
   *   ],
   *   onSubmit: ({ schemaOutputs }) => saveBooking(schemaOutputs[0]),
   * })
   * ```
   *
   * @returns The original options object, normalized to `FormOptions` with
   * omitted, nullable, and undefined editable states merged into the schema's
   * input shape.
   * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
   * @typeParam TFormData - Library-managed. Do not specify explicitly.
   * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
   */
  looseSchema: FormOptionsLooseSchemaFn<TComponents>
}

/**
 * Keeps form data, validator, and submission types inferred when options are
 * declared separately from a framework's form creation API.
 *
 * The regular helper takes `defaultValues` at face value as the form data
 * shape. For schema-driven inference, use `formOptions.strictSchema` when the
 * schema defines an input-to-output boundary, or `formOptions.looseSchema` when
 * the schema defines the shape but editable defaults may omit properties or
 * need `null` or `undefined` values.
 *
 * At runtime, this is an identity helper: it returns the original options
 * object and does not create a form or run validation.
 *
 * @remarks
 * **Important:** Although this returns the original object unchanged at
 * runtime, its type is normalized to `FormOptions`. Optional properties such
 * as `validators` therefore remain optional even when supplied. This tradeoff
 * enables safer inference and reuse.
 *
 * @example
 * ```ts
 * const profileOptions = formOptions({
 *   defaultValues: { name: '' },
 *   validators: [
 *     {
 *       triggers: ['change'],
 *       run: ({ value }) =>
 *         value.name.length === 0 ? 'Name is required' : undefined,
 *     },
 *   ],
 * })
 *
 * const form = useForm({
 *   ...profileOptions,
 *   onSubmit: ({ value }) => saveProfile(value),
 * })
 * ```
 */
const formOptions = ((opts) => {
  return opts
}) as FormOptionsApi<unknown>

formOptions.strictSchema = (opts) => opts
formOptions.looseSchema = (opts) => opts as never

export { formOptions }
