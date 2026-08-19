import type { FormOptions } from './FormApi/FormApi.public'
import type { StandardSchemaV1 } from './standardSchema.public'
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

type StandardSchemaInput<TSchema extends StandardSchemaV1<any, any>> =
  TSchema extends StandardSchemaV1<infer TInput, any> ? TInput : never

type LooseSchemaFormOptions<
  TSchemaInput,
  TFormData extends Editable<TSchemaInput>,
  TFormValidators extends FormValidators<
    NoInfer<InferUnion<TFormData, TSchemaInput>>
  >,
  TSubmitReturn,
> = Omit<
  FormOptions<
    InferUnion<TFormData, TSchemaInput>,
    TFormValidators,
    TSubmitReturn,
    unknown
  >,
  'defaultValues'
> & {
  defaultValues: TFormData
}

/**
 * The overloads used to type strict schema form options.
 *
 * Both overloads return the original object unchanged at runtime, but
 * normalize its type to `FormOptions`. Optional properties such as
 * `validators` therefore remain optional in the returned type.
 *
 * @typeParam TComponents - Library-managed. Do not specify explicitly.
 */
export type FormOptionsStrictSchemaFn<TComponents> = {
  /**
   * Types strict form options using a separate schema as the source of the
   * form data type.
   *
   * The schema input fixes the form data type before the options are inferred,
   * so `defaultValues` and each callback validator's `value` use the exact
   * schema input type.
   *
   * The first argument is used only by TypeScript and is ignored at runtime.
   * Include the schema in `validators` as well when it should validate the
   * form. Parsed results are available in the corresponding `schemaOutputs`
   * entries during submission.
   *
   * @example
   * ```ts
   * const profileSchema = z.object({ name: z.string().min(1) })
   * const profileOptions = formOptions.strictSchema(profileSchema, {
   *   defaultValues: { name: '' },
   *   validators: [
   *     { triggers: ['change'], run: profileSchema },
   *     {
   *       triggers: ['change'],
   *       run: ({ value }) =>
   *         value.name.length === 0 ? 'Name is required' : undefined,
   *     },
   *   ],
   * })
   * ```
   *
   * @param schema - Supplies the form data type without registering a
   * validator.
   * @param options - The form options to type against the schema input.
   * @returns The original options object, normalized to `FormOptions` with the
   * schema input as its form data type.
   * @typeParam TSchema - Library-managed. Do not specify explicitly.
   * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
   * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
   */
  <
    const TSchema extends StandardSchemaV1<any, any>,
    const TFormValidators extends FormValidators<StandardSchemaInput<TSchema>>,
    TSubmitReturn,
  >(
    schema: TSchema,
    options: FormOptions<
      StandardSchemaInput<TSchema>,
      TFormValidators,
      TSubmitReturn,
      unknown
    >,
  ): FormOptions<
    StandardSchemaInput<TSchema>,
    TFormValidators,
    TSubmitReturn,
    TComponents
  >

  /**
   * Types strict form options by inferring the form data type from the schemas
   * in `validators`.
   *
   * `defaultValues` must match the schemas' input type.
   *
   * @important TypeScript inference for this overload can break when
   * `validators` contains callback validators or is omitted. Callback
   * validator `value` parameters may become `any`, which can also make the
   * inferred form data type less precise. For mixed or callback-only
   * validators, or no validators, pass a typing schema first and the options
   * second.
   *
   * @example
   * ```ts
   * const profileOptions = formOptions.strictSchema({
   *   defaultValues: { name: '' },
   *   validators: [{ triggers: ['submit'], run: profileSchema }],
   * })
   * ```
   *
   * @param options - Form options whose schemas supply the form data type.
   * @returns The original options object, normalized to `FormOptions` with the
   * inferred schema input as its form data type.
   * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
   * @typeParam TFormData - Library-managed. Do not specify explicitly.
   * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
   */
  <
    const TFormValidators extends FormValidators<any>,
    // Not quite sure why, but using FormValidatorData directly in the generic breaks things.
    // Probably something recursive going on that resolves it to `never`?
    TFormData extends FormValidatorData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown>,
  ): FormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn,
    TComponents
  >
}

/**
 * The overloads used to type loose schema form options.
 *
 * Both overloads return the original object unchanged at runtime, but
 * normalize its type to `FormOptions`. Optional properties such as
 * `validators` therefore remain optional in the returned type.
 *
 * @typeParam TComponents - Library-managed. Do not specify explicitly.
 */
export type FormOptionsLooseSchemaFn<TComponents> = {
  /**
   * Types loose schema form options using a separate schema as the source of
   * the final valid form shape.
   *
   * `defaultValues` infer an editable form shape constrained by the schema
   * input, so properties may be omitted or contain `null` or `undefined`.
   * Callback validator `value` parameters use that editable shape merged with
   * the schema input.
   *
   * The first argument is used only by TypeScript and is ignored at runtime.
   * Include the schema in `validators` as well when it should validate the
   * form. Parsed results are available in the corresponding `schemaOutputs`
   * entries during submission.
   *
   * @example
   * ```ts
   * const bookingSchema = z.object({ startDate: z.date() })
   * const bookingOptions = formOptions.looseSchema(bookingSchema, {
   *   defaultValues: { startDate: null },
   *   validators: [
   *     { triggers: ['blur'], run: bookingSchema },
   *     {
   *       triggers: ['change'],
   *       run: ({ value }) =>
   *         value.startDate === null ? 'Choose a date' : undefined,
   *     },
   *   ],
   * })
   * ```
   *
   * @param schema - Supplies the final valid form shape without registering a
   * validator.
   * @param options - The form options used to infer the editable form shape.
   * @returns The original options object, normalized to `FormOptions` with the
   * editable states merged into the schema input.
   * @typeParam TSchema - Library-managed. Do not specify explicitly.
   * @typeParam TFormData - Library-managed. Do not specify explicitly.
   * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
   * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
   */
  <
    const TSchema extends StandardSchemaV1<any, any>,
    const TFormData extends Editable<StandardSchemaInput<TSchema>>,
    const TFormValidators extends FormValidators<
      NoInfer<InferUnion<TFormData, StandardSchemaInput<TSchema>>>
    >,
    TSubmitReturn,
  >(
    schema: TSchema,
    options: LooseSchemaFormOptions<
      StandardSchemaInput<TSchema>,
      TFormData,
      TFormValidators,
      TSubmitReturn
    >,
  ): FormOptions<
    InferUnion<TFormData, StandardSchemaInput<TSchema>>,
    TFormValidators,
    TSubmitReturn,
    TComponents
  >

  /**
   * Types loose schema form options by inferring the final valid form shape
   * from the schemas in `validators`.
   *
   * `defaultValues` may omit schema properties or use `null` or `undefined`
   * for intermediate editing states.
   *
   * @important TypeScript inference for this overload can break when
   * `validators` contains callback validators or is omitted. Callback
   * validator `value` parameters may become `any`, which can also make the
   * inferred form data type less precise. For mixed or callback-only
   * validators, or no validators, pass a typing schema first and the options
   * second.
   *
   * @example
   * ```ts
   * const bookingOptions = formOptions.looseSchema({
   *   defaultValues: { startDate: null },
   *   validators: [{ triggers: ['submit'], run: bookingSchema }],
   * })
   * ```
   *
   * @param options - Form options whose schemas supply the final valid shape.
   * @returns The original options object, normalized to `FormOptions` with the
   * editable states merged into the inferred schema input.
   * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
   * @typeParam TFormData - Library-managed. Do not specify explicitly.
   * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
   */
  <
    const TFormValidators extends FormValidators<any>,
    const TFormData extends NullableSchemaData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown>,
  ): FormOptions<
    InferUnion<TFormData, FormValidatorData<TFormValidators>>,
    TFormValidators,
    TSubmitReturn,
    TComponents
  >
}

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
   * Pass the schema as the first argument when the options also contain
   * callback validators. This fixes the form data to the schema input before
   * the options are inferred, so each callback receives a typed `value`. The
   * first argument is ignored at runtime; include the schema in `validators`
   * when it should run. The single-argument overload continues to infer the
   * schema from `validators`.
   *
   * @remarks
   * **Important:** Although this returns the original object unchanged at
   * runtime, its type is normalized to `FormOptions`. Optional properties such
   * as `validators` therefore remain optional even when supplied. This
   * tradeoff enables safer inference and reuse.
   *
   * @example
   * ```ts
   * const profileSchema = z.object({ name: z.string().min(1) })
   * const profileOptions = formOptions.strictSchema(profileSchema, {
   *   defaultValues: { name: '' },
   *   validators: [
   *     {
   *       triggers: ['change'],
   *       run: profileSchema,
   *     },
   *     {
   *       triggers: ['change'],
   *       run: ({ value }) =>
   *         value.name.length === 0 ? 'Name is required' : undefined,
   *     },
   *   ],
   *   onSubmit: ({ schemaOutputs }) => saveProfile(schemaOutputs[0]),
   * })
   * ```
   *
   * @returns The original options object, normalized to `FormOptions` with the
   * schema's input shape.
   * @typeParam TSchema - Library-managed. Do not specify explicitly.
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
   * Pass the schema as the first argument when the options also contain
   * callback validators. `defaultValues` infer an editable form shape
   * constrained by the schema input, and callbacks receive that shape merged
   * with the schema input. The first argument is ignored at runtime; include
   * the schema in `validators` when it should run. The single-argument overload
   * continues to infer the schema from `validators`.
   *
   * @remarks
   * **Important:** Although this returns the original object unchanged at
   * runtime, its type is normalized to `FormOptions`. Optional properties such
   * as `validators` therefore remain optional even when supplied. This
   * tradeoff enables safer inference and reuse.
   *
   * @example
   * ```ts
   * const bookingSchema = z.object({ startDate: z.date() })
   * const bookingOptions = formOptions.looseSchema(bookingSchema, {
   *   defaultValues: { startDate: null },
   *   validators: [
   *     {
   *       triggers: ['blur'],
   *       run: bookingSchema,
   *     },
   *     {
   *       triggers: ['change'],
   *       run: ({ value }) =>
   *         value.startDate === null ? 'Choose a date' : undefined,
   *     },
   *   ],
   *   onSubmit: ({ schemaOutputs }) => saveBooking(schemaOutputs[0]),
   * })
   * ```
   *
   * @returns The original options object, normalized to `FormOptions` with
   * omitted, nullable, and undefined editable states merged into the schema's
   * input shape.
   * @typeParam TSchema - Library-managed. Do not specify explicitly.
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
const formOptions = ((opts) => opts) as FormOptionsApi<unknown>

formOptions.strictSchema = ((schemaOrOpts: unknown, opts?: unknown) =>
  opts ?? schemaOrOpts) as never
formOptions.looseSchema = ((schemaOrOpts: unknown, opts?: unknown) =>
  opts ?? schemaOrOpts) as never

export { formOptions }
