import type { Component } from 'vue'

export interface VueFormComponentMap<
  TFormComponents extends Record<string, Component>,
  TFieldComponents extends Record<string, Component>,
> {
  formComponents: TFormComponents
  fieldComponents: TFieldComponents
}

export type AnyVueFormComponentMap = VueFormComponentMap<
  Record<string, Component>,
  Record<string, Component>
>

export type DefaultVueFormComponentMap = VueFormComponentMap<
  Record<never, never>,
  Record<never, never>
>
