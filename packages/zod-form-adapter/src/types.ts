import type { zodValidator } from './validator'

/**
 * Utility to define your Form type as `FormApi<FormData, ZodValidator>`
 */
export type ZodValidator = ReturnType<typeof zodValidator>
