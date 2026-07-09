import { describe, expect, it } from 'vitest'
import { useSelector, useStore } from '../src'

describe('package exports', () => {
  it('exports useSelector and useStore from @tanstack/react-store', () => {
    expect(useSelector).toBeTypeOf('function')
    expect(useStore).toBeTypeOf('function')
  })
})
