import { InternalFieldApi } from '@tanstack/form-core/internals'
import type { ReactComponentTree } from './componentMap.public'

export function createInternalReactAppFieldApiClass(
  fieldComponents: ReactComponentTree,
): typeof InternalFieldApi {
  class InternalReactAppFieldApi extends InternalFieldApi<any, any, any> {}

  Object.assign(InternalReactAppFieldApi.prototype, fieldComponents)

  return InternalReactAppFieldApi as typeof InternalFieldApi
}
