import { describe, expect, it, vi } from 'vitest'
import { FormApi } from '../src/index'

describe('form event client', () => {
  it('should not connect to the devtools event bus outside development', () => {
    const onConnect = vi.fn()
    window.addEventListener('tanstack-connect', onConnect)

    const form = new FormApi({ defaultValues: { name: '' } })
    form.mount()

    window.removeEventListener('tanstack-connect', onConnect)
    expect(onConnect).not.toHaveBeenCalled()
  })
})
