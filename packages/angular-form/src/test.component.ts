import { Directive, Input } from '@angular/core'

@Directive({
  selector: '[tanstackField]',
  standalone: true,
})
export class TanStackField {
  @Input() tanstackField: any
}

export function injectForm(opts?: any) {
  return {} as any
}
