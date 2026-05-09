import type { FunctionComponent } from 'react'

/**
 * This type mess takes care of react 17-19 cross compatability.
 */
export type CrossVersionReactNode = ReturnType<FunctionComponent<{}>>
