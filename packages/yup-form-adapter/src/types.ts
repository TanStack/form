import type { yupValidator } from './validator'

/**
 * Utility to define your Form type as `FormApi<FormData, YupValidator>`
 */
export type YupValidator = ReturnType<typeof yupValidator>
