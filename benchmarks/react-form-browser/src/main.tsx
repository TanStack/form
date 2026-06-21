import { createFormikController } from './implementations/formik'
import { createReactHookFormController } from './implementations/react-hook-form'
import { createTanStackController } from './implementations/tanstack'
import { parseScenarioVariant } from './scenarios'
import type { ImplementationId } from './browser-bench.types'

function createController() {
  const params = new URLSearchParams(window.location.search)
  const implementation = params.get('implementation')

  if (!isImplementationId(implementation)) {
    throw new Error(`Unsupported implementation: ${implementation}`)
  }

  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Missing #root element')
  }

  const context = {
    implementation: implementation satisfies ImplementationId,
    root,
    variant: parseScenarioVariant(params),
  }

  switch (implementation) {
    case 'formik':
      return createFormikController(context)
    case 'react-hook-form':
      return createReactHookFormController(context)
    case 'tanstack':
      return createTanStackController(context)
  }
}

window.__bench = createController()

function isImplementationId(value: string | null): value is ImplementationId {
  return (
    value === 'formik' || value === 'react-hook-form' || value === 'tanstack'
  )
}
