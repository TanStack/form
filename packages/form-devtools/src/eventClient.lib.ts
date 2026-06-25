import { EventClient } from '@tanstack/devtools-event-client'
import type { FormEventMap } from './eventClientTypes'

export const formEventClient = new EventClient<FormEventMap>({
  pluginId: 'tanstack-form',
})
