/// <reference lib="dom" />
import type { LitElement } from 'lit'

const registered = new Set<string>()
const mountedElements = new Set<LitElement>()

export function defineOnce(name: string, ctor: CustomElementConstructor) {
  if (!registered.has(name) && !window.customElements.get(name)) {
    window.customElements.define(name, ctor)
    registered.add(name)
  }
}

export async function mount<T extends LitElement>(tag: string): Promise<T> {
  const el = document.createElement(tag) as T
  document.body.appendChild(el)
  await el.updateComplete
  mountedElements.add(el)
  return el
}

export function cleanup() {
  for (const el of mountedElements) el.remove()
  mountedElements.clear()
}
