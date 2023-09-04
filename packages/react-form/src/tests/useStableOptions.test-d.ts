import { assertType, it, describe } from 'vitest'
import { useStableOpts } from '../utils/useStableOptions'

interface PersonOptions {
  name: string
  age: number
  speak: () => void
}

describe('useStableOpts', () => {
  it('should be okay when stableKeys has all the keys', () => {
    const opts = useStableOpts(
      {
        name: 'bob',
        age: 12,
        speak: () => {},
      },
      {
        stableKeys: ['speak', 'age', 'name'],
        unstableKeys: [],
      } as const,
    )

    assertType<PersonOptions>(opts)
  })

  it('should be okay when unstableKeys has all the keys', () => {
    const opts = useStableOpts(
      {
        name: 'bob',
        age: 12,
        speak: () => {},
      },
      {
        stableKeys: [],
        unstableKeys: ['name', 'age', 'speak'],
      } as const,
    )

    assertType<PersonOptions>(opts)
  })

  it('should not care what order unstableKeys are in', () => {
    const opts = useStableOpts(
      {
        name: 'bob',
        age: 12,
        speak: () => {},
      },
      {
        stableKeys: [],
        unstableKeys: ['speak', 'age', 'name'],
      } as const,
    )

    assertType<PersonOptions>(opts)
  })

  it('should be fine when all keys are accounted for between two arrays', () => {
    const opts = useStableOpts(
      {
        name: 'bob',
        age: 12,
        speak: () => {},
      },
      {
        stableKeys: ['speak', 'age'],
        unstableKeys: ['name'],
      } as const,
    )

    assertType<PersonOptions>(opts)
  })

  it('should throw an error when unstable keys does not include one of the keys from the object', () => {
    const opts = useStableOpts(
      {
        name: 'bob',
        age: 12,
        speak: () => {},
      },
      {
        stableKeys: ['speak', 'age'],
        // @ts-expect-error
        unstableKeys: [],
      } as const,
    )

    assertType<PersonOptions>(opts)
  })
})
