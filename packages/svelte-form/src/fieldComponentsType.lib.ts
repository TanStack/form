import type { Component } from 'svelte'

declare const fieldComponentsSymbol: unique symbol

// Preserve component-map compatibility across Svelte's generic component signatures.
export interface SvelteFieldComponentsType<
  TFieldComponents extends Record<string, Component<any>>,
> {
  readonly [fieldComponentsSymbol]?: TFieldComponents
}
