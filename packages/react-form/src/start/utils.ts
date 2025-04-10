import { getCookie, setCookie } from '@tanstack/react-start/server'
import * as devalue from 'devalue'

export const _tanstackInternalsCookie = {
  name: 'tanstack-internals',
  parse: () => {
    const cookie = getCookie(_tanstackInternalsCookie.name)
    if (!cookie) return undefined
    return devalue.parse(cookie)
  },
  save: (data: any) => {
    const cookie = devalue.stringify(data)
    setCookie(_tanstackInternalsCookie.name, cookie)
  },
}
