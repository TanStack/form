import { Injectable, inject, signal } from '@angular/core'
import { FieldApi } from '@tanstack/form-core'

@Injectable({ providedIn: null })
export class TanStackFieldInjectable<T> {
  _api = signal<
    FieldApi<
      any,
      any,
      T,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  >(null as never)

  get api() {
    return this._api()
  }
}

export function injectField<T>(): TanStackFieldInjectable<T> {
  return inject(TanStackFieldInjectable<T>)
}
