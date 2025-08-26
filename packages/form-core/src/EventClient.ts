import { EventClient } from '@tanstack/devtools-event-client'

import type { AnyFormState } from './FormApi'

type EventMap = {
  'form-devtools:broadcast-form-state': { id: string; state: AnyFormState }
  'form-devtools:request-form-state': { id: string }
  'form-devtools:broadcast-form-unmounted': { id: string }
}

class FormEventClient extends EventClient<EventMap> {
  constructor() {
    super({
      // debug: true,
      pluginId: 'form-devtools',
    })
  }
}

export const formEventClient = new FormEventClient()
