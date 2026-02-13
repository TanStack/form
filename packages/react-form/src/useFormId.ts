import * as React from 'react'
import { useUUID } from './useUUID'

/**
 * React 17 does not have the useId hook, so we use a random uuid as a fallback.
 * This is needed to avoid bundlers trying to import non-existing export.
 * Read more: https://github.com/webpack/webpack/issues/14814
 */
const _React = React
export const useFormId =
  React.version.split('.')[0] === '17' ? useUUID : _React.useId
