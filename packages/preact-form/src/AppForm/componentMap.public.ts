import type { FunctionComponent } from 'preact/compat'

export interface PreactFormComponentMap<
  in out TFormComponents extends Record<string, FunctionComponent<any>>,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  formComponents: TFormComponents
  fieldComponents: TFieldComponents
}

export type AnyPreactFormComponentMap = PreactFormComponentMap<
  Record<string, FunctionComponent<any>>,
  Record<string, FunctionComponent<any>>
>

export type DefaultPreactFormComponentMap = PreactFormComponentMap<
  Record<never, never>,
  Record<never, never>
>
