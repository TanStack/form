import type {
  GetFormErrorTypes,
  ToFormErrorTypes,
} from '../validation/state.public'
import type { ErrorVisibility } from './errorVisibility.public'
import type { FormListeners } from './formListeners.public'
import type { ServerFormState } from './formServerState.public'
import type {
  FormOptionsOnSubmitFn,
  GetValidatorOutputs,
} from './formSubmit.public'
import type { FormOptionsValidators } from '../validation/formValidators.public'
import type {
  StandardSchemaInput,
  StandardSchemaV1,
} from '../standardSchema.public'
import type { Editable, InferUnion } from '../utils.public'

declare const formOptionsComponentsSymbol: unique symbol

type TryGetValidatorOutputs<TValidators> =
  TValidators extends ReadonlyArray<unknown>
    ? GetValidatorOutputs<TValidators>
    : []

export interface FormOptions<
  TFormData,
  TValidatorConfig extends unknown[],
  TValidators,
  out TComponents,
> {
  readonly [formOptionsComponentsSymbol]?: TComponents
  defaultValues: TFormData
  formId?: string
  errorVisibility?: ErrorVisibility<NoInfer<TFormData>>
  validators?: TValidators &
    FormOptionsValidators<NoInfer<TFormData>, TValidatorConfig>
  listeners?: FormListeners<
    NoInfer<TFormData>,
    NoInfer<GetFormErrorTypes<TValidators>>
  >
  serverState?: NoInfer<ServerFormState<TFormData, TValidators>> | null
  // TODO infer return submit for errors
  onSubmit?: FormOptionsOnSubmitFn<
    NoInfer<TFormData>,
    NoInfer<TryGetValidatorOutputs<TValidators>>,
    NoInfer<GetFormErrorTypes<TValidators>>
  >
}

export type FormOptionsStrictSchemaFn<out TComponents> = <
  TSchema extends StandardSchemaV1<any, any>,
  const TValidatorConfig extends unknown[],
  TValidators,
>(
  schema: TSchema,
  options: FormOptions<
    NoInfer<StandardSchemaInput<TSchema>>,
    TValidatorConfig,
    TValidators,
    unknown
  >,
) => FormOptions<
  NoInfer<StandardSchemaInput<TSchema>>,
  TValidatorConfig,
  TValidators,
  TComponents
>

type LooseSchemaFormOptions<
  TSchemaInput,
  TFormData extends Editable<TSchemaInput>,
  TValidatorConfig extends unknown[],
  TValidators,
> = Omit<
  FormOptions<
    InferUnion<TFormData, TSchemaInput>,
    TValidatorConfig,
    TValidators,
    unknown
  >,
  'defaultValues'
> & {
  defaultValues: TFormData
}

export type FormOptionsLooseSchemaFn<out TComponents> = <
  TSchema extends StandardSchemaV1<any, any>,
  const TFormData extends Editable<StandardSchemaInput<TSchema>>,
  const TValidatorConfig extends unknown[],
  TValidators,
>(
  schema: TSchema,
  options: LooseSchemaFormOptions<
    StandardSchemaInput<TSchema>,
    TFormData,
    TValidatorConfig,
    TValidators
  >,
) => FormOptions<
  InferUnion<TFormData, StandardSchemaInput<TSchema>>,
  TValidatorConfig,
  TValidators,
  TComponents
>

export interface FormOptionsApi<out TComponents> {
  <TFormData, const TValidatorConfig extends unknown[], TValidators>(
    options: FormOptions<TFormData, TValidatorConfig, TValidators, unknown>,
  ): FormOptions<TFormData, TValidatorConfig, TValidators, TComponents>

  strictSchema: FormOptionsStrictSchemaFn<TComponents>
  looseSchema: FormOptionsLooseSchemaFn<TComponents>
}

export const formOptions = ((opts) => opts) as FormOptionsApi<unknown>

formOptions.strictSchema = (_schema, opts) => opts
formOptions.looseSchema = (_schema, opts) => opts as never
