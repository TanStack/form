import { SubmissionAttempt } from '../submissionAttempt.lib'
import { getBy } from '../utils.lib'
import type {
  AnyInternalFormGroupApi,
  InternalFormGroupApi,
  InternalGroupValidatorInstance,
} from './FormGroupApi.lib'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { ClientValidationRun } from '../pipeline/validation/clientValidation.lib'
import type { FormGroupValidators } from '../pipeline/validation/validation.public'
import type { SubmissionOutcome } from '../submissionAttempt.lib'
import type { FormattedValidationError } from '../validation/results/results.public'
import type { ScopedErrorTypes } from '../validation/state.public'

export interface FormGroupValidationOutcome<TGroupValue> {
  errors: Array<FormattedValidationError<TGroupValue>>
  run: ClientValidationRun<InternalGroupValidatorInstance> | null
}

async function runFormGroupSubmissionCallbacks<TGroupValue>(
  group: AnyInternalFormGroupApi,
  submission: SubmissionAttempt<FormattedValidationError<TGroupValue>>,
  validationOutcome: FormGroupValidationOutcome<TGroupValue>,
): Promise<SubmissionOutcome<FormattedValidationError<TGroupValue>>> {
  const value = submission.value
  const invalidContext = {
    value,
    formApi: group.form,
    groupApi: group,
  } as never

  if (validationOutcome.errors.length > 0) {
    await group._options.onSubmitInvalid?.(invalidContext)
    return { errors: validationOutcome.errors, successful: false }
  }

  const submitContext = {
    value,
    formApi: group.form,
    groupApi: group,
    validatorOutputs:
      validationOutcome.run?.collector.getOutputs(
        validationOutcome.run.validatorCount,
      ) ?? [],
  } as never

  try {
    await group._options.onSubmit?.(submitContext)
  } catch (error) {
    if (!submission.isActive()) return { errors: [], successful: false }
    await group._options.onSubmitInvalid?.(invalidContext)
    if (!submission.isActive()) return { errors: [], successful: false }
    throw error
  }

  return { errors: [], successful: true }
}

export function handleFormGroupSubmit<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormError extends ScopedErrorTypes,
>(
  group: InternalFormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormError
  >,
  submissions: Set<SubmissionAttempt<FormattedValidationError<TGroupValue>>>,
): Promise<Array<FormattedValidationError<TGroupValue>>> {
  const values = group.form.state.values
  const submission = new SubmissionAttempt<
    FormattedValidationError<TGroupValue>
  >({
    values,
    value: getBy(values, group.name),
    node: group._groupField,
    validators: group._validatorInstances,
    owner: {
      submissions,
      submissionAttempts: group._submissionAttempts,
      isSubmitting: group._isSubmitting,
      isSubmitSuccessful: group._isSubmitSuccessful,
    },
  })
  submission.start({
    validate: () => group._validate('submit', { submission }),
    callbacks: (validation) =>
      runFormGroupSubmissionCallbacks(group, submission, validation),
  })
  return submission.promise
}
