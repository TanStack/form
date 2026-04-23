export interface TemplateOptions {
  message?: string
}

export type BrandedString<TName extends string> = string & { __brand?: TName }
