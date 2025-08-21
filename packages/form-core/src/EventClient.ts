import { EventClient } from '@tanstack/devtools-event-client'

import type { AnyFormState } from './FormApi'

type EventMap = {
  'form-devtools:form-state': { id: string; state: AnyFormState }
}

class FormEventClient extends EventClient<EventMap> {
  constructor() {
    super({
      debug: true,
      pluginId: 'form-devtools',
    })
  }
}

export const DevtoolsEventClient = new FormEventClient()
