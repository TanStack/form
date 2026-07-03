import { EventClient } from '@tanstack/devtools-event-client'
import type { FormDevtoolsEventMap } from './eventClientTypes'

export const formDevtoolsEventClient = new EventClient<FormDevtoolsEventMap>({
  pluginId: 'tanstack-form',
})
