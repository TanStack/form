import { Injectable, inject, signal } from '@angular/core'
import { FieldApi } from '@tanstack/form-core'

@Injectable({ providedIn: null })
export class TanStackFieldInjectable<T> {
  api = signal<
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
      any
    >
  >(null as never)
}

export function injectField<T>(): TanStackFieldInjectable<T> {
  return inject(TanStackFieldInjectable<T>)
}
