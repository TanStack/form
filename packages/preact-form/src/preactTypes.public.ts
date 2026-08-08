import type { FunctionComponent } from 'preact/compat'

/**
 * Keeps component children compatible across supported Preact versions.
 */
export type CrossVersionPreactNode = ReturnType<FunctionComponent<{}>>
