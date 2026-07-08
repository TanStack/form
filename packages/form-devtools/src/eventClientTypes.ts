import type { FormId } from './types/branded'

export interface DevtoolsMountedForm {
  label: string
  instanceId: FormId
}

export type FormDevtoolsEventMap = {
  'mounted-forms-changed': {
    forms: Array<DevtoolsMountedForm>
  }
  'request-mounted-forms': Record<string, never>
}
