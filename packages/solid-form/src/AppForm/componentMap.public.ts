import type { Component } from 'solid-js'

export interface SolidFormComponentMap<
  TFormComponents extends Record<string, Component<any>>,
  TFieldComponents extends Record<string, Component<any>>,
> {
  formComponents: TFormComponents
  fieldComponents: TFieldComponents
}

export type AnySolidFormComponentMap = SolidFormComponentMap<
  Record<string, Component<any>>,
  Record<string, Component<any>>
>

export type DefaultSolidFormComponentMap = SolidFormComponentMap<
  Record<never, never>,
  Record<never, never>
>
