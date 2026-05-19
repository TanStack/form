import type { AnyInternalFieldApi } from './FieldApi.lib'
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
  extends FieldUpdateOptions, FieldApiOverrideOptions, PropagateOptions {
  /**
   * @private
   * Whether to use `tryGetFieldApi` or `getOrCreateFieldApi`.
   *
   * @default boolean - derived from whether field meta needs to be stored
   */
  _skipFieldCreation?: boolean
}

export interface PropagateOptions {
  /**
   * @private
   * Whether to propagate the action to parent field nodes.
   * @default boolean - So far, always true. Maybe a future case needs it to be false.
   */
  doPropagate?: boolean
}

export type ResolvedInternalFieldUpdateOptions =
  Required<InternalFieldUpdateOptions>
