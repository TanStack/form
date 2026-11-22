import { createErrorMap } from '../../validation/results/createErrorMap.lib'
import { parseIssuesFactory } from '../../validation/results/parseIssues.lib'
import { createOutput } from '../../validation/results/validationOutput.lib'
import type { ClientSideEvents } from '../events.public'
import type { FieldErrorTarget } from '../../validation/results/results.public'
import type {
  FormValidatorClientContext,
  FormValidatorPreprocessContext,
  FormValidatorServerContext,
} from './formValidators.public'
import type {
  FieldValidatorContext,
  FormGroupValidatorContext,
} from './validation.public'

interface ValidatorContextDefinition {
  run: unknown
  fieldErrorTarget?: FieldErrorTarget
}

interface FormClientInput {
  event: ClientSideEvents
  value: any
  signal: AbortSignal
  formApi: any
  triggerFieldApi?: any
}

interface FieldContextInput {
  event: ClientSideEvents | 'mount'
  value: any
  signal: AbortSignal
  formApi: any
  fieldApi: any
}

interface GroupContextInput {
  event: ClientSideEvents | 'mount'
  value: any
  signal: AbortSignal
  formApi: any
  groupApi: any
  triggerFieldApi?: any
}

function createResultHelpers(
  definition: ValidatorContextDefinition,
  value: any,
) {
  return {
    createErrorMap,
    parseIssues: parseIssuesFactory(
      value,
      definition.fieldErrorTarget ?? 'field',
    ),
    createOutput,
  }
}

/**
 * This context is used for events where the formApi is present.
 *
 * This is NOT usable for `onSubmit` context.
 */
export function createFormClientValidatorContext(
  definition: ValidatorContextDefinition,
  input: FormClientInput,
): FormValidatorClientContext<any, ClientSideEvents> {
  const { value } = input
  return {
    event: input.event,
    value,
    signal: input.signal,
    formApi: input.formApi,
    triggerFieldApi: input.triggerFieldApi,
    ...createResultHelpers(definition, value),
  }
}

/**
 * This context is used for mount, since formApi is not constructed yet.
 */
export function createFormMountValidatorContext(
  definition: ValidatorContextDefinition,
  input: { value: any },
): FormValidatorPreprocessContext<any, 'mount'> {
  const { value } = input
  return {
    event: 'mount',
    value,
    ...createResultHelpers(definition, value),
  }
}

/**
 * This context is used on the server, since formApi does not exist there.
 */
export function createFormServerValidatorContext(
  definition: ValidatorContextDefinition,
  input: { value: any },
): FormValidatorServerContext<any, 'server'> {
  const { value } = input
  return {
    event: 'server',
    value,
    ...createResultHelpers(definition, value),
  }
}

/**
 * This context is used on the field. Always client-side.
 */
export function createFieldValidatorContext(
  _definition: ValidatorContextDefinition,
  input: FieldContextInput,
): FieldValidatorContext<any, any, any> {
  return {
    event: input.event,
    value: input.value,
    signal: input.signal,
    formApi: input.formApi,
    fieldApi: input.fieldApi,
  }
}

/**
 * This context is used on the form group. Always client-side.
 */
export function createGroupValidatorContext(
  definition: ValidatorContextDefinition,
  input: GroupContextInput,
): FormGroupValidatorContext<any> {
  const { value } = input
  return {
    event: input.event,
    value,
    signal: input.signal,
    formApi: input.formApi,
    groupApi: input.groupApi,
    triggerFieldApi: input.triggerFieldApi,
    ...createResultHelpers(definition, value),
  }
}
