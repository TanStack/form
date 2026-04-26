import type { InternalFieldApi } from './FieldApi.lib'
import type { FieldUpdateOptions } from './types.public'

export interface FieldApiOverrideOptions {
  /**
   * @private
   * The field node to treat as the source for updates.
   * Intended to be a shorthand if the lookup has already been performed before. If omitted, the form will attempt its own lookup.
   */
  fieldApiOverride?: InternalFieldApi<any>
}

export interface InternalFieldUpdateOptions
  extends FieldUpdateOptions, FieldApiOverrideOptions {}
