import type { JSX } from 'solid-js'
import type { DevtoolsFieldError } from '@/eventClientTypes'
import type { FieldId } from '@/types/branded'
import type { FormDevtoolsStore } from '@/stores/formDevtoolsStore'

export interface FieldErrorDebugDetails {
  title: JSX.Element
  description: JSX.Element
  commonCase: JSX.Element
  fixes: Array<JSX.Element>
}

export interface FieldErrorDebugCaseContext {
  fieldId: FieldId
  error: DevtoolsFieldError
  store: FormDevtoolsStore
}

export interface FieldErrorDebugCase {
  evaluate: (
    context: FieldErrorDebugCaseContext,
  ) => FieldErrorDebugDetails | undefined
}
