import { liteThrottle } from '@tanstack/pacer-lite'
import { formEventClient } from './EventClient'

import type { AnyFormApi } from './FormApi'

export const throttleFormState = liteThrottle(
  (form: AnyFormApi) =>
    formEventClient.emit('form-state', {
      id: form.formId,
      state: form.store.state,
    }),
  {
    wait: 300,
  },
)
