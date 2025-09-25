import { EventClient } from '@tanstack/devtools-event-client'

import type { AnyFormOptions, AnyFormState } from './FormApi'

type ExtractEventNames<T> = T extends `${string}:${infer EventName}`
  ? EventName
  : never

export type BroadcastFormState = {
  id: string
  state: AnyFormState
  options: AnyFormOptions
}

export type BroadcastFormSubmissionState =
  | {
    id: string
    submissionAttempt: number
    successful: false
    stage: 'validateAllFields' | 'validate'
    errors: any[]
  }
  | {
    id: string
    submissionAttempt: number
    successful: false
    stage: 'inflight'
    onError: unknown
  }
  | {
    id: string
    submissionAttempt: number
    successful: true
  }

export type BroadcastFormUnmounted = {
  id: string
}

export type RequestFormState = {
  id: string
}

export type RequestFormReset = {
  id: string
}

export type RequestFormForceReset = {
  id: string
}

type EventMap = {
  'form-devtools:form-state-change': BroadcastFormState
  'form-devtools:form-submission-state-change': BroadcastFormSubmissionState
  'form-devtools:form-unmounted': BroadcastFormUnmounted
  'form-devtools:request-form-state': RequestFormState
  'form-devtools:request-form-reset': RequestFormReset
  'form-devtools:request-form-force-submit': RequestFormForceReset
}

export type EventClientEventMap = keyof EventMap

export type EventClientEventNames = ExtractEventNames<EventClientEventMap>

export class FormEventClient extends EventClient<EventMap> {
  constructor() {
    super({
      pluginId: 'form-devtools',
    })
  }
}
