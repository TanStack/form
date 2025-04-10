import { getCookie } from '@tanstack/react-start/server'

// See: https://github.com/remix-run/remix/blob/412f9182d6dc30ebeba3f7f1b1a93d9c3e8242be/packages/remix-server-runtime/cookies.ts

// See: https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.unescape.js
function myUnescape(value: string): string {
  const str = value.toString()
  let result = ''
  let index = 0
  let chr, part
  while (index < str.length) {
    chr = str.charAt(index++)
    if (chr === '%') {
      if (str.charAt(index) === 'u') {
        part = str.slice(index + 1, index + 5)
        if (/^[\da-f]{4}$/i.exec(part)) {
          result += String.fromCharCode(parseInt(part, 16))
          index += 5
          continue
        }
      } else {
        part = str.slice(index, index + 2)
        if (/^[\da-f]{2}$/i.exec(part)) {
          result += String.fromCharCode(parseInt(part, 16))
          index += 2
          continue
        }
      }
    }
    result += chr
  }
  return result
}

function encodeData(value: any): string {
  return btoa(myUnescape(encodeURIComponent(JSON.stringify(value))))
}

export const _tanstackInternalsCookie = {
  name: 'tanstack-internals',
  parse: () => {
    const cookie = getCookie(_tanstackInternalsCookie.name)
    if (!cookie) return undefined
    const data = JSON.parse(cookie)
    return data
  },
  serialize: (data: any) => encodeData(data),
}
