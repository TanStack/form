import { uuid } from './utils'
import type { FieldMeta } from './FieldApi.types'
import { createAtom } from '@tanstack/store'

export class FieldApi {
  readonly fieldId: string
  form: any
  name: string

  constructor(form: any, name: string) {
    this.form = form
    this.name = name

    const store = createAtom<any>(() => {})

    this.fieldId = uuid()
  }
}
