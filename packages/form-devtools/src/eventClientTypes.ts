export interface DevtoolsMountedForm {
  formId: string
  instanceId: string
}

export type FormDevtoolsEventMap = {
  'mounted-forms-changed': {
    forms: Array<DevtoolsMountedForm>
  }
  'request-mounted-forms': Record<string, never>
}
