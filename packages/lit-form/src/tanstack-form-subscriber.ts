import type { ReactiveController, ReactiveControllerHost } from 'lit'

interface Subscribable {
  subscribe(listener: () => void): { unsubscribe: () => void }
}

/**
 * A Lit `ReactiveController` that subscribes a host element to any
 * TanStack Store (e.g. `form.api.store`, `field.store`) and triggers a
 * re-render whenever that store updates.
 *
 * Use this in custom elements that receive a form or field as a property
 * (rather than owning the `TanStackFormController` themselves), so they
 * re-render when the underlying state changes even though the property
 * reference is unchanged.
 *
 * @example
 * ```ts
 * @customElement('address-fields')
 * export class AddressFields extends LitElement {
 *   @property({ attribute: false })
 *   form!: typeof formType
 *
 *   constructor() {
 *     super()
 *     new TanStackFormSubscriber(this, () => this.form?.api.store)
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * @customElement('text-field')
 * export class TextField extends LitElement {
 *   @property({ attribute: false })
 *   field!: AnyFieldApi
 *
 *   constructor() {
 *     super()
 *     new TanStackFormSubscriber(this, () => this.field?.store)
 *   }
 * }
 * ```
 */
export class TanStackFormSubscriber implements ReactiveController {
  #host: ReactiveControllerHost
  #getStore: () => Subscribable | undefined
  #unsubscribe?: () => void
  #subscribedStore?: Subscribable

  constructor(
    host: ReactiveControllerHost,
    getStore: () => Subscribable | undefined,
  ) {
    this.#host = host
    this.#getStore = getStore
    host.addController(this)
  }

  hostUpdate() {
    const store = this.#getStore()
    if (store === this.#subscribedStore) return
    this.#unsubscribe?.()
    this.#subscribedStore = store
    if (!store) {
      this.#unsubscribe = undefined
      return
    }
    this.#unsubscribe = store.subscribe(() => {
      this.#host.requestUpdate()
    }).unsubscribe
  }

  hostDisconnected() {
    this.#unsubscribe?.()
    this.#unsubscribe = undefined
    this.#subscribedStore = undefined
  }
}
