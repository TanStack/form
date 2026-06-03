import type { FunctionComponent } from 'react'

export interface ReactFormComponentMap<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  formComponents: TFormComponents
  fieldComponents: TFieldComponents
}

export type AnyReactFormComponentMap = ReactFormComponentMap<
  Record<string, FunctionComponent<any>>,
  Record<string, FunctionComponent<any>>
>

export type DefaultReactFormComponentMap = ReactFormComponentMap<
  Record<never, never>,
  Record<never, never>
>
