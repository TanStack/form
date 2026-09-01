import { InternalFieldApi } from '@tanstack/form-core/internals'
import type { FunctionComponent } from 'react'

type FieldComponents = Record<string, FunctionComponent<any>>

export function createInternalReactAppFieldApiClass(
  fieldComponents: FieldComponents,
): typeof InternalFieldApi {
  class InternalReactAppFieldApi extends InternalFieldApi<any, any, any> {}

  Object.assign(InternalReactAppFieldApi.prototype, fieldComponents)

  return InternalReactAppFieldApi as typeof InternalFieldApi
}
