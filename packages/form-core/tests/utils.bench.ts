import { bench, describe } from 'vitest'
import { makePathArray } from '../src/utils'

// Snapshot of the original implementation for side-by-side comparison.
// Remove this and the paired benches once the new implementation is merged.
const reLineOfOnlyDigits = /^(\d+)$/gm
const reDigitsBetweenDots = /\.(\d+)(?=\.)/gm
const reStartWithDigitThenDot = /^(\d+)\./gm
const reDotWithDigitsToEnd = /\.(\d+$)/gm
const reMultipleDots = /\.{2,}/gm
const intPrefix = '__int__'
const intReplace = `${intPrefix}$1`

function makePathArrayOld(
  str: string | Array<string | number>,
): Array<string | number> {
  if (Array.isArray(str)) {
    return [...str]
  }

  if (typeof str !== 'string') {
    throw new Error('Path must be a string.')
  }

  return str
    .replace(/(^\[)|]/gm, '')
    .replace(/\[/g, '.')
    .replace(reLineOfOnlyDigits, intReplace)
    .replace(reDigitsBetweenDots, `.${intReplace}.`)
    .replace(reStartWithDigitThenDot, `${intReplace}.`)
    .replace(reDotWithDigitsToEnd, `.${intReplace}`)
    .replace(reMultipleDots, '.')
    .split('.')
    .map((d) => {
      if (d.startsWith(intPrefix)) {
        const numStr = d.substring(intPrefix.length)
        const num = parseInt(numStr, 10)
        if (String(num) === numStr) {
          return num
        }
        return numStr
      }
      return d
    })
}

const cases: Array<[label: string, input: string | Array<string | number>]> = [
  ['array input (fast path, no parsing)', ['a', 'b', 0, 'c']],
  ['simple key (no nesting)', 'key'],
  ['uuid key', '550e8400-e29b-41d4-a716-446655440000'],
  ['dot notation', 'foo.bar.baz'],
  ['mixed dot and bracket notation', 'a[0].b[1]'],
  ['deeply nested mixed path', 'a.b[0][1].c.d[2][3].e'],
  ['numeric string with leading zeros (kept as string)', '01234'],
  ['numeric string (converted to number)', '12345'],
]

for (const [label, input] of cases) {
  describe(label, () => {
    bench('old', () => {
      makePathArrayOld(input)
    })

    bench('new', () => {
      makePathArray(input)
    })
  })
}
