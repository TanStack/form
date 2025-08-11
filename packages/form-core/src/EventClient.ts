import { EventClient } from '@tanstack/devtools-event-client'

import type { AnyFormApi } from './FormApi'

type EventMap = {
  'form-devtools:form-state': { state: AnyFormApi }
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
