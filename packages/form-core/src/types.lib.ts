import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type { FieldUpdateOptions } from './types.public'

export interface FieldApiOverrideOptions {
  /**
   * @private
   * The field node to treat as the source for updates.
   * Intended to be a shorthand if the lookup has already been performed before. If omitted, the form will attempt its own lookup.
   */
  fieldApiOverride?: AnyInternalFieldApi | null
}

export interface InternalFieldUpdateOptions
  extends
    FieldUpdateOptions,
    FieldApiOverrideOptions,
    NotifyParentFieldsOptions {
  /**
   * @private
   * Whether to use `tryGetFieldApi` or `getOrCreateFieldApi`.
   *
   * @default boolean - derived from whether field meta needs to be stored
   */
  _skipFieldCreation?: boolean
}

export interface NotifyParentFieldsOptions {
  /**
   * @private
   * Whether to walk up to parent fields to notify their listeners and apply blurred flags.
   * @default true
   */
  notifyParentFields?: boolean
}

export type ResolvedInternalFieldUpdateOptions =
  Required<InternalFieldUpdateOptions>
