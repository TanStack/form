import type { Component } from 'svelte'

export interface SvelteFormComponentMap<
  TFormComponents extends Record<string, Component<any>>,
  TFieldComponents extends Record<string, Component<any>>,
> {
  formComponents: TFormComponents
  fieldComponents: TFieldComponents
}

export type AnySvelteFormComponentMap = SvelteFormComponentMap<
  Record<string, Component<any>>,
  Record<string, Component<any>>
>

export type DefaultSvelteFormComponentMap = SvelteFormComponentMap<
  Record<never, never>,
  Record<never, never>
>
